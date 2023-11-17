import path from "path";


type uploadPathType = 'full' | 'filepath' | 'dirpath'

export default function (dir?: string[], type: uploadPathType = 'full') {
  switch (type) {
    case "full":
      return path.join(path.dirname(require.main.path), `uploads`, ...dir)
    case "filepath":
      return path.join(...dir)
    case "dirpath":
      return path.join(path.dirname(require.main.path), `uploads`)
  }
}