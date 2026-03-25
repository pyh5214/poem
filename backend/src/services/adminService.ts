import db from '../db';
import { PoetOption, SystemSetting, SystemSettingRow } from '../types';

const rowToSetting = (row: SystemSettingRow): SystemSetting => ({
  key: row.key,
  value: JSON.parse(row.value),
  updatedAt: row.updated_at,
  updatedBy: row.updated_by,
});

export const adminService = {
  // Get overall statistics
  getStats() {
    // User stats
    const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
    const blockedUsers = (db.prepare('SELECT COUNT(*) as count FROM users WHERE is_blocked = 1').get() as { count: number }).count;

    const today = new Date().toISOString().split('T')[0];
    const newUsersToday = (db.prepare('SELECT COUNT(*) as count FROM users WHERE created_at >= ?').get(today) as { count: number }).count;

    // Postcard stats
    const totalPostcards = (db.prepare('SELECT COUNT(*) as count FROM postcards').get() as { count: number }).count;
    const publicPostcards = (db.prepare('SELECT COUNT(*) as count FROM postcards WHERE is_public = 1').get() as { count: number }).count;
    const postcardsToday = (db.prepare('SELECT COUNT(*) as count FROM postcards WHERE created_at >= ?').get(today) as { count: number }).count;

    // Postcards by style
    const styleQuery = db.prepare('SELECT poet_style, COUNT(*) as count FROM postcards GROUP BY poet_style');
    const styleRows = styleQuery.all() as { poet_style: string; count: number }[];
    const postcardsByStyle: Record<PoetOption, number> = { A: 0, B: 0, C: 0, D: 0 };
    styleRows.forEach(row => {
      if (row.poet_style in postcardsByStyle) {
        postcardsByStyle[row.poet_style as PoetOption] = row.count;
      }
    });

    return {
      users: {
        totalUsers,
        activeUsers: totalUsers - blockedUsers,
        blockedUsers,
        newUsersToday,
      },
      postcards: {
        totalPostcards,
        publicPostcards,
        postcardsToday,
        postcardsByStyle,
      },
    };
  },

  // Get daily stats for charts (last 30 days)
  getDailyStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const userQuery = db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    const userStats = userQuery.all(startDateStr) as { date: string; count: number }[];

    const postcardQuery = db.prepare(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM postcards
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    const postcardStats = postcardQuery.all(startDateStr) as { date: string; count: number }[];

    return {
      newUsers: userStats,
      newPostcards: postcardStats,
    };
  },

  // Get system setting
  getSetting(key: string): SystemSetting | null {
    const stmt = db.prepare('SELECT * FROM system_settings WHERE key = ?');
    const row = stmt.get(key) as SystemSettingRow | undefined;
    return row ? rowToSetting(row) : null;
  },

  // Get all system settings
  getAllSettings(): SystemSetting[] {
    const stmt = db.prepare('SELECT * FROM system_settings ORDER BY key');
    const rows = stmt.all() as SystemSettingRow[];
    return rows.map(rowToSetting);
  },

  // Update or create system setting
  setSetting(key: string, value: any, updatedBy: string): SystemSetting {
    const now = new Date().toISOString();
    const valueJson = JSON.stringify(value);

    const stmt = db.prepare(`
      INSERT INTO system_settings (key, value, updated_at, updated_by)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = excluded.updated_at,
        updated_by = excluded.updated_by
    `);
    stmt.run(key, valueJson, now, updatedBy);

    return {
      key,
      value,
      updatedAt: now,
      updatedBy,
    };
  },

  // Delete system setting
  deleteSetting(key: string): boolean {
    const stmt = db.prepare('DELETE FROM system_settings WHERE key = ?');
    const result = stmt.run(key);
    return result.changes > 0;
  },
};
