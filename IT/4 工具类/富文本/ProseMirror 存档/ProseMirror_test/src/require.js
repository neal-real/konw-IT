function require(name) {
  let id = /^prosemirror-(.*)/.exec(name), mod = id && PM[id[1].replace(/-/g, "_")]
  if (!mod) throw new Error(`Library basic isn't loaded`)
  return mod
}