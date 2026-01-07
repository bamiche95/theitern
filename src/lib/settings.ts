import db from "@/lib/db";

// Standard async function without the cache wrapper
export const getSiteSettings = async () => {
  const [rows]: any = await db.query(
    "SELECT setting_key, setting_value FROM site_settings"
  );

  return rows.reduce((acc: any, row: any) => {
    try {
      acc[row.setting_key] = JSON.parse(row.setting_value);
    } catch {
      acc[row.setting_key] = row.setting_value;
    }
    return acc;
  }, {});
};

export const getPublicNavigation = async () => {
  const [rows]: any = await db.query(
    "SELECT * FROM nav_items WHERE is_active = 1 ORDER BY display_order ASC"
  );

  const map: Record<number, any> = {};
  const tree: any[] = [];

  rows.forEach((r: any) => (map[r.id] = { ...r, children: [] }));
  rows.forEach((r: any) => {
    if (r.parent_id && map[r.parent_id]) {
      map[r.parent_id].children.push(map[r.id]);
    } else {
      tree.push(map[r.id]);
    }
  });

  return tree;
};

export const getSiteFeatures = async () => {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM site_features WHERE is_active = 1 ORDER BY display_order ASC"
    );
    
    return rows;
  } catch (error) {
    console.error("Error fetching features:", error);
    return [];
  }
};