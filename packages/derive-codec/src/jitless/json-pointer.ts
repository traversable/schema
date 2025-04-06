export namespace JsonPointer {
  /** 
   * ## {@link escape `JsonPointer.escape`}
   * 
   * As specified in 
   * [`RFC-6901`](https://datatracker.ietf.org/doc/html/rfc6901#section-3).
   */
  export function escape(component: string | number): string
  export function escape(_component: string | number, $ = _component + ''): string {
    if ($.indexOf("~") === -1 && $.indexOf("/") === -1) return $
    let chars = [...$],
      out = "",
      char: string | undefined
    while ((char = chars.shift()) !== undefined)
      out +=
        char === "/" ? "~1" :
          char === "~" ? "~0" :
            char
    return out
  }

  /** 
   * ## {@link unescape `JsonPointer.unescape`}
   * 
   * As specified in 
   * [`RFC-6901`](https://datatracker.ietf.org/doc/html/rfc6901#section-3).
   */
  export function unescape(component: string | number): string
  export function unescape(_component: string | number, $ = _component + ''): string {
    if ($.indexOf("~") === -1) return $
    let out = "",
      char: string,
      next: string
    for (let ix = 0, len = $.length; ix < len; ix++) {
      char = $[ix]
      next = $[ix + 1] ?? ""
      if (char === "~" && next === "1") void ((out += "/"), ix++)
      else if (char === "~" && next === "0") void ((out += "~"), ix++)
      else void (out += char)
    }
    return out
  }
}
