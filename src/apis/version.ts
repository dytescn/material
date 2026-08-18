// src/apis/version.ts
const API_URL = "http://127.0.0.1:44944/database";
const DB_PATH = "./material";

const dbFetch = async (symbol: string, body: any) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const dbQuery = async (sql: string, path: string = DB_PATH) => {
  const raw = await dbFetch("db_query", { path, sql });
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if (Array.isArray(raw.data)) return raw.data;
    if (raw.data && typeof raw.data === "object") {
      if (Array.isArray(raw.data.rows)) return raw.data.rows;
      if (Array.isArray(raw.data.result)) return raw.data.result;
      if (Array.isArray(raw.data.list)) return raw.data.list;
    }
    if (Array.isArray(raw.result)) return raw.result;
    if (Array.isArray(raw.rows)) return raw.rows;
  }
  return [];
};

const dbInsert = (sql: string, path: string = DB_PATH) => dbFetch("db_insert", { path, sql });
const dbUpdate = (sql: string, path: string = DB_PATH) => dbFetch("db_update", { path, sql });
const dbDelete = (sql: string, path: string = DB_PATH) => dbFetch("db_delete", { path, sql });

export const insertMaterialVersion = async (data: any) => {
  const sql = `
    INSERT INTO material_version (
      uuid, cover, design_uid, child_uid, soft_ver, name, logs, fuid, create_by
    ) VALUES (
      '${data.uuid || ""}', '${data.cover || ""}', '${data.design_uid || ""}',
      '${data.child_uid || ""}', '${data.soft_ver || ""}', '${data.name || ""}',
      '${data.logs || ""}', '${data.fuid || ""}', '${data.create_by || ""}'
    )
  `;
  return await dbInsert(sql);
};

export const updateMaterialVersion = async (id: number, data: any) => {
  const setFields: string[] = [];
  const allowed = ["uuid", "cover", "design_uid", "child_uid", "soft_ver", "name", "logs", "fuid", "create_by"];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      const val = typeof data[key] === "string" ? `'${data[key]}'` : data[key];
      setFields.push(`${key} = ${val}`);
    }
  }
  if (setFields.length === 0) throw new Error("No fields to update");
  setFields.push(`updated_at = datetime('now','localtime')`);
  const sql = `UPDATE material_version SET ${setFields.join(", ")} WHERE id = ${id}`;
  return await dbUpdate(sql);
};

export const softDeleteMaterialVersion = async (id: number) => {
  const sql = `UPDATE material_version SET deleted_at = datetime('now','localtime') WHERE id = ${id}`;
  return await dbUpdate(sql);
};

export const deleteMaterialVersion = async (id: number) => {
  const sql = `DELETE FROM material_version WHERE id = ${id}`;
  return await dbDelete(sql);
};

export const getMaterialVersionById = async (id: number) => {
  const rows = await dbQuery(`SELECT * FROM material_version WHERE id = ${id} AND deleted_at IS NULL`);
  return rows?.[0] || null;
};

export const getMaterialVersionList = async (where = "", order = "id DESC", limit?: number) => {
  let sql = `SELECT * FROM material_version WHERE deleted_at IS NULL`;
  if (where) sql += ` AND ${where}`;
  sql += ` ORDER BY ${order}`;
  if (limit) sql += ` LIMIT ${limit}`;
  return await dbQuery(sql);
};

export const getMaterialVersionsByDesignUid = async (designUid: string) => {
  return await getMaterialVersionList(`design_uid = '${designUid}'`);
};

export const getMaterialVersionsByFuid = async (fuid: string) => {
  return await getMaterialVersionList(`fuid = '${fuid}'`);
};