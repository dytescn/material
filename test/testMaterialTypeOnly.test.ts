// test/materialTypeOnly.test.ts
import {
  insertMaterialType,
  getMaterialTypeList,
  getMaterialTypeById,
  updateMaterialType,
  softDeleteMaterialType,
  deleteMaterialType,
  getMaterialTypeByName,
} from "../src/apis/type.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testMaterialTypeOnly() {
  console.log("===== 素材类型模块独立测试 =====");

  const typeName = "音频类型";

  console.log("1. 插入素材类型...");
  const typeData = {
    uuid: "type-only-001",
    type_name: typeName,
    icon: "audio-icon",
  };
  const insertRes = await insertMaterialType(typeData);
  console.log("  插入结果:", insertRes);
  await sleep(100);

  console.log("2. 查询所有类型（最新 5 条）...");
  const all = await getMaterialTypeList('', 'id DESC', 5);
  console.log(`  共 ${all.length} 条`);
  const id = all[0]?.id;
  if (!id) { console.error("  无记录，退出"); return; }

  console.log(`3. 按 ID 查询 (${id})...`);
  const byId = await getMaterialTypeById(id);
  console.log("  结果:", byId);

  console.log("4. 按类型名称查询...");
  const byName = await getMaterialTypeByName(typeName);
  console.log(`  找到 ${byName.length} 条`);

  console.log("5. 更新类型图标...");
  await updateMaterialType(id, { icon: "new-audio-icon" });
  const updated = await getMaterialTypeById(id);
  console.log("  更新后:", updated);

  console.log("6. 软删除...");
  await softDeleteMaterialType(id);
  const deleted = await getMaterialTypeById(id);
  console.log("  软删除后 (应为 null):", deleted);

  console.log("7. 物理删除...");
  await deleteMaterialType(id);
  const final = await getMaterialTypeById(id);
  console.log("  物理删除后 (应为 null):", final);

  console.log("===== 素材类型测试完成 =====\n");
}

testMaterialTypeOnly().catch(console.error);