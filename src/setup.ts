const API_URL = "http://127.0.0.1:44944/database";

// ========== 1. 创建 routers 表（可选，若不需要路由可删除此段） ==========
// 该表用于存储前端菜单/路由配置，此处仅作示例，您可按需保留或注释
const createTableRes = await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_create",
    },
    body: JSON.stringify({
        path: "./router",          // routers 数据库独立存放，保持原样
        table: "routers",
        schema: `id INTEGER PRIMARY KEY,
                 title TEXT,
                 icon TEXT,
                 hide INTEGER,
                 path TEXT,
                 child TEXT,
                 url TEXT,
                 show INTEGER,
                 parent_id INTEGER,
                 level INTEGER`,
    }),
});
console.log("创建 routers 表:", await createTableRes.json());

// 若您需要为素材模块添加路由，可参考以下示例（根据需要启用）：
/*
// 清理旧的素材路由（假设存在）
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_insert" },
    body: JSON.stringify({
        path: "router",
        sql: "DELETE FROM routers WHERE parent_id IN (SELECT id FROM routers WHERE title = '素材')",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_insert" },
    body: JSON.stringify({
        path: "router",
        sql: "DELETE FROM routers WHERE title = '素材'",
    }),
});
// 插入素材一级菜单
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_insert" },
    body: JSON.stringify({
        path: "router",
        sql: `INSERT INTO routers (id, title, icon, hide, path, parent_id, level)
              VALUES (5, '素材', 'ic-material', 0, '/material', 0, 1)`,
    }),
});
// 插入素材列表二级菜单
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_insert" },
    body: JSON.stringify({
        path: "router",
        sql: `INSERT INTO routers (id, title, icon, hide, path, url, show, parent_id, level)
              VALUES (6, 'material-list', '', 0, '/material/list', '/material/list.js', 1, 5, 2)`,
    }),
});
console.log("素材路由插入成功");
*/

// ========== 2. 创建 material 数据库的三个表 ==========
// 所有表存放在 ./material 数据库中

// 2.1 素材文件表
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_update",
    },
    body: JSON.stringify({
        path: "./material",
        sql: `
            CREATE TABLE IF NOT EXISTS material_file (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT,
                puid TEXT,
                ouid TEXT,
                flow_uid TEXT,
                type_uid TEXT,
                name TEXT,
                "desc" TEXT,          -- desc 是 SQL 保留字，需加双引号
                cover TEXT,
                create_by TEXT,
                created_at TEXT,
                updated_at TEXT,
                deleted_at TEXT
            )
        `,
    }),
});
console.log("material_file 表创建成功");

// 2.2 素材类型表
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_update",
    },
    body: JSON.stringify({
        path: "./material",
        sql: `
            CREATE TABLE IF NOT EXISTS material_type (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT,
                type_name TEXT,
                icon TEXT,
                created_at TEXT,
                updated_at TEXT,
                deleted_at TEXT
            )
        `,
    }),
});
console.log("material_type 表创建成功");

// 2.3 素材版本表
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_update",
    },
    body: JSON.stringify({
        path: "./material",
        sql: `
            CREATE TABLE IF NOT EXISTS material_version (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT,
                cover TEXT,
                page_uid TEXT,
                child_uid TEXT,
                soft_ver TEXT,
                name TEXT,
                logs TEXT,
                fuid TEXT,
                create_by TEXT,
                created_at TEXT,
                updated_at TEXT,
                deleted_at TEXT
            )
        `,
    }),
});
console.log("material_version 表创建成功");

console.log("所有素材数据库初始化任务完成！");