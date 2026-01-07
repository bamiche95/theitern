// src/lib/bootstrap.ts
import db from "@/lib/db";

export const getBootstrapData = 
  async () => {
    const [settingsRows]: any[] = await db.query(
      "SELECT setting_key, setting_value FROM site_settings"
    );
    const settings = settingsRows.reduce((acc: any, row: any) => {
      try {
        acc[row.setting_key] = JSON.parse(row.setting_value);
      } catch {
        acc[row.setting_key] = row.setting_value;
      }
      return acc;
    }, {});

    const [navRows]: any[] = await db.query(
      "SELECT * FROM nav_items WHERE is_active = 1 ORDER BY display_order ASC"
    );

    const map: Record<number, any> = {};
    const nav: any[] = [];
    navRows.forEach((r: any) => (map[r.id] = { ...r, children: [] }));
    navRows.forEach((r: any) => {
      if (r.parent_id && map[r.parent_id]) {
        map[r.parent_id].children.push(map[r.id]);
      } else {
        nav.push(map[r.id]);
      }
    });

    return { settings, nav };
  };
