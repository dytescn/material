import { card_tpl } from "../view/card.ts";
import { getProjects } from "../apis/projects.ts";
import type { Tpl } from "@funxdata/pages/tplstype";
// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export const project_init = async () => {
  const project_node = document.getElementById("all-cards-content");
  if (!project_node) return;

  // 1. 确保卡片容器存在（位于按钮之后）

  try {
    const projects = await getProjects();
    console.log(projects);
    if (!projects || projects.length === 0) {
      // project_node.innerHTML = "<p>暂无项目</p>";
      return;
    }
    // 仅更新卡片容器内容，不影响按钮 
    const cards_html = await TplToHtml.renderString(card_tpl, {
      projects: projects,
    });
    project_node.insertAdjacentHTML('beforeend', cards_html);
  } catch (error) {
    console.error("获取项目列表失败:", error);
    // cardsContainer.innerHTML = "<p>加载失败，请刷新重试</p>";
  }
};