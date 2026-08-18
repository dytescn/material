const API_URL = "http://127.0.0.1:44944/database";
const ROUTER_DB = "./router";

// ========== 1. 清理旧素材路由（防止重复插入） ==========
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_delete" },
    body: JSON.stringify({
        path: ROUTER_DB,
        sql: "DELETE FROM routers WHERE id IN (300, 301) OR parent_id IN (300, 301)",
    }),
});
console.log("旧素材路由清理完成");

// ========== 2. 插入素材一级菜单（固定 ID 300） ==========
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_insert" },
    body: JSON.stringify({
        path: ROUTER_DB,
        sql: `INSERT INTO routers (id, title, icon, hide, path, parent_id, level)
              VALUES (300, '素材', 'ic-sample', 0, '/material', 0, 1)`,
    }),
});
console.log("素材父路由插入成功");

// ========== 3. 插入素材列表二级菜单（parent_id = 300） ==========
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_insert" },
    body: JSON.stringify({
        path: ROUTER_DB,
        sql: `INSERT INTO routers (id, title, icon, hide, path, url, show, parent_id, level)
              VALUES (301, '素材列表', '', 0, '/material', '/material/material.js', 1, 300, 2)`,
    }),
});
console.log("素材子路由插入成功");

const MATERIAL_DB = "./material";

// ========== 4. 素材文件表 ==========
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_update",
    },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: `
            CREATE TABLE IF NOT EXISTS material_file (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL UNIQUE,
                project_uid TEXT,
                organ_uid TEXT,
                flow_uid TEXT,
                type_uid TEXT,
                name TEXT,
                description TEXT,
                cover TEXT,
                create_by TEXT,
                created_at TEXT DEFAULT (datetime('now','localtime')),
                updated_at TEXT DEFAULT (datetime('now','localtime')),
                deleted_at TEXT
            )
        `,
    }),
});
console.log("material_file 表创建成功");

// ========== 5. 素材类型表（type_name 添加唯一约束） ==========
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_update",
    },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: `
            CREATE TABLE IF NOT EXISTS material_type (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL UNIQUE,
                type_name TEXT UNIQUE,
                icon TEXT,
                created_at TEXT DEFAULT (datetime('now','localtime')),
                updated_at TEXT DEFAULT (datetime('now','localtime')),
                deleted_at TEXT
            )
        `,
    }),
});
console.log("material_type 表创建成功");

// ========== 6. 素材版本表 ==========
await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/libary",
        "FFI-Symbol": "db_update",
    },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: `
            CREATE TABLE IF NOT EXISTS material_version (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT NOT NULL UNIQUE,
                cover TEXT,
                design_uid TEXT,
                child_uid TEXT,
                soft_ver TEXT,
                name TEXT,
                logs TEXT,
                fuid TEXT,
                create_by TEXT,
                created_at TEXT DEFAULT (datetime('now','localtime')),
                updated_at TEXT DEFAULT (datetime('now','localtime')),
                deleted_at TEXT
            )
        `,
    }),
});
console.log("material_version 表创建成功");

// ========== 7. 素材文件表索引 ==========
// 单列索引
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_file_project_uid ON material_file(project_uid)",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_file_organ_uid ON material_file(organ_uid)",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_file_type_uid ON material_file(type_uid)",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_file_deleted_at ON material_file(deleted_at)",
    }),
});

// 复合索引（优化常见筛选组合）
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_file_type_deleted ON material_file(type_uid, deleted_at)",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_file_project_deleted ON material_file(project_uid, deleted_at)",
    }),
});

// ========== 8. 素材类型表索引 ==========
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_type_uuid ON material_type(uuid)",
    }),
});

// ========== 9. 素材版本表索引 ==========
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_version_design_uid ON material_version(design_uid)",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_version_child_uid ON material_version(child_uid)",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_version_fuid ON material_version(fuid)",
    }),
});
// 复合索引
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_version_design_deleted ON material_version(design_uid, deleted_at)",
    }),
});
await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/libary", "FFI-Symbol": "db_update" },
    body: JSON.stringify({
        path: MATERIAL_DB,
        sql: "CREATE INDEX IF NOT EXISTS idx_material_version_child_deleted ON material_version(child_uid, deleted_at)",
    }),
});

console.log("素材库所有表及索引创建完成");