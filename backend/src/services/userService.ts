import db from '../db';
import { User, UserRow, UserRole } from '../types';

const rowToUser = (row: UserRow): User => ({
  id: row.id,
  googleId: row.google_id,
  email: row.email,
  name: row.name,
  profileImage: row.profile_image,
  role: row.role as UserRole,
  isBlocked: row.is_blocked === 1,
  createdAt: row.created_at,
  lastLoginAt: row.last_login_at,
});

export const userService = {
  // List all users with pagination
  list(page: number = 1, limit: number = 20, search?: string) {
    const offset = (page - 1) * limit;

    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let listQuery = 'SELECT * FROM users';
    const params: any[] = [];

    if (search) {
      const whereClause = ' WHERE email LIKE ? OR name LIKE ?';
      countQuery += whereClause;
      listQuery += whereClause;
      params.push(`%${search}%`, `%${search}%`);
    }

    listQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

    const countStmt = db.prepare(countQuery);
    const { total } = (search
      ? countStmt.get(params[0], params[1])
      : countStmt.get()) as { total: number };

    const listStmt = db.prepare(listQuery);
    const rows = (search
      ? listStmt.all(...params, limit, offset)
      : listStmt.all(limit, offset)) as UserRow[];

    return {
      items: rows.map(rowToUser),
      total,
      page,
      limit,
    };
  },

  // Get user by ID
  getById(id: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id) as UserRow | undefined;
    return row ? rowToUser(row) : null;
  },

  // Block/unblock user
  setBlocked(id: string, isBlocked: boolean): User | null {
    const stmt = db.prepare('UPDATE users SET is_blocked = ? WHERE id = ?');
    const result = stmt.run(isBlocked ? 1 : 0, id);

    if (result.changes === 0) return null;
    return this.getById(id);
  },

  // Update user role
  setRole(id: string, role: UserRole): User | null {
    const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?');
    const result = stmt.run(role, id);

    if (result.changes === 0) return null;
    return this.getById(id);
  },

  // Delete user and their data
  delete(id: string): boolean {
    // Foreign key cascade will handle postcards deletion
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Get user stats
  getStats() {
    const total = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
    const blocked = (db.prepare('SELECT COUNT(*) as count FROM users WHERE is_blocked = 1').get() as { count: number }).count;
    const admins = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin'").get() as { count: number }).count;

    const today = new Date().toISOString().split('T')[0];
    const newToday = (db.prepare('SELECT COUNT(*) as count FROM users WHERE created_at >= ?').get(today) as { count: number }).count;

    return {
      totalUsers: total,
      activeUsers: total - blocked,
      blockedUsers: blocked,
      adminUsers: admins,
      newUsersToday: newToday,
    };
  },
};
