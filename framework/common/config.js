const path = require("path")
const fs = require("fs")
const merge = require("deepmerge")

const ALLOWED_FW = ["shopify", "bigcommerce", "shopify_local"]


function withFrameworkConfig(defaultConfig = {}) {
  let framework = defaultConfig?.framework?.name

  if (!framework) {
    throw new Error("The api framework is missing, please add a valid provider!")
  }
  
  if (!ALLOWED_FW.includes(framework)) {
    throw new Error(`The api framework: ${framework} cannot be found, please use ${ALLOWED_FW.join(" or ")}`)
  }

  if (framework === "shopify_local") {
    framework = ALLOWED_FW[0]
  }

  const frameworkNextConfig = require(path.join("../", framework, "next.config"))
  const config = merge(defaultConfig, frameworkNextConfig)

  const tsPath = path.join(process.cwd(), "tsconfig.json")
  const tsConfig = require(tsPath)

  tsConfig.compilerOptions.paths["@framework"] = [`framework/${framework}`]
  tsConfig.compilerOptions.paths["@framework/*"] = [`framework/${framework}/*`]

  fs.writeFileSync(
    tsPath,
      JSON.stringify(tsConfig), { parser: "json" }
  )

  return config
}

module.exports = { withFrameworkConfig }