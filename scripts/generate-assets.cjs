// 扫描 public/assets/ 自动生成 src/assets/index.ts
// 用法: node scripts/generate-assets.cjs

const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "..", "public", "assets");
const OUTPUT_FILE = path.join(__dirname, "..", "src", "assets", "index.ts");

// 递归扫描目录，返回嵌套对象 { key: filePath | subObj }
function scanDir(dir, basePath) {
  const result = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(basePath, fullPath);

    if (entry.isDirectory()) {
      const sub = scanDir(fullPath, basePath);
      if (Object.keys(sub).length > 0) {
        result[entry.name] = sub;
      }
    } else {
      // 文件：用文件名（去扩展名）作为 key，重名则带扩展名
      const ext = path.extname(entry.name);
      const nameWithoutExt = entry.name.slice(0, -ext.length);
      const publicPath = "/assets/" + relPath.split(path.sep).join("/");

      if (result[nameWithoutExt] !== undefined) {
        result[entry.name] = publicPath;
      } else {
        result[nameWithoutExt] = publicPath;
      }
    }
  }

  return result;
}

// 把对象转为 TS 代码字符串
function toTS(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  const entries = Object.entries(obj);
  if (entries.length === 0) return "{}";

  const lines = entries.map(([key, value]) => {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
      ? key
      : JSON.stringify(key);
    if (typeof value === "object" && value !== null) {
      return `${pad}  ${safeKey}: ${toTS(value, indent + 1)},`;
    }
    return `${pad}  ${safeKey}: ${JSON.stringify(value)},`;
  });

  return `{\n${lines.join("\n")}\n${pad}}`;
}

// 确保目录存在
if (!fs.existsSync(ASSETS_DIR)) {
  console.error("资源目录不存在:", ASSETS_DIR);
  process.exit(1);
}

const assets = scanDir(ASSETS_DIR, ASSETS_DIR);
const tsCode = [
  "// 自动生成，禁止手动修改",
  "// 运行 npm run gen:assets 重新生成",
  "",
  `export const AppAssets = ${toTS(assets)} as const;`,
  "",
].join("\n");

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, tsCode);
console.log("✅ AppAssets 已生成:", path.relative(process.cwd(), OUTPUT_FILE));
