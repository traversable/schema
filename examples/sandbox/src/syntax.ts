import { t } from './lib'

t.array(t.boolean)

t.eq([1, false, 'hey', void 0, null, undefined])

/** Source: https://github.com/nashamri/spacemacs-theme/blob/master/spacemacs-theme.el */
export const spacemacs = {
  // generic
  "act1": "#e7e5eb",
  "act2": "#d3d3e7",
  "base": "#655370",
  "base-dim": "#a094a2",
  "bg1": "#fbf8ef",
  "bg2": "#efeae9",
  "bg3": "#e3dedd",
  "bg4": "#d2ceda",
  "bg-alt": "#efeae9",
  "border": "#b3b9be",
  "brown": "#7c3813",
  "cblk": "#655370",
  "cblk-bg": "#e8e3f0",
  "cblk-ln": "#9380b2",
  "cblk-ln-bg": "#ddd8eb",
  "cursor": "#100a14",
  "const": "#4e3163",
  "comment": "#2aa1ae",
  "comment-light": "#a49da5",
  "comment-bg": "#ecf3ec",
  "comp": "#6c4173",
  "err": "#e0211d",
  "func": "#6c3163",
  "head1": "#3a81c3",
  "head1-bg": "#edf1ed",
  "head2": "#2d9574",
  "head2-bg": "#edf2e9",
  "head3": "#67b11d",
  "head3-bg": "#edf2e9",
  "head4": "#b1951d",
  "head4-bg": "#f6f1e1",
  "highlight": "#d3d3e7",
  "highlight-dim": "#e7e7fc",
  "keyword": "#a8a8bf",
  "mat": "#ba2f59",
  "meta": "#da8b55",
  "prop": "rgb(107 83 176)",
  "str": "#2d9574",
  "suc": "#42ae2c",
  "ttip": "#8c799f",
  "ttip-sl": "#c8c6dd",
  "ttip-bg": "#e2e0ea",
  "ttype": "#ba2f59",
  "type": "rgb(143 77 178)",
  //
  "var": "#715ab1",
  "war": "#dc752f",
  // colors
  "aqua": "#2d9574",
  "aqua-bg": "#edf2e9",
  "green": "#67b11d",
  "green-bg": "#edf2e9",
  "green-bg-s": "#dae6d0",
  "cyan": "#21b8c7",
  "red": "#f2241f",
  "red-bg": "#faede4",
  "red-bg-s": "#eed9d2",
  "blue": "#3a81c3",
  "blue-bg": "#edf1ed",
  "blue-bg-s": "#d1dcdf",
  "magenta": "#a31db1",
  "yellow": "#b1951d",
  "yellow-bg": "#f6f1e1",
} as const

interface Style {
  foreground?: string
  background?: string
  border?: string
  fontStyles?: FontStyle[]
  color?: string
}
type FontStyle = 'bold' | 'italic' | 'underline' | 'none'

const bg
  : (token: string, ...fontStyles: FontStyle[]) => Style
  = (token, ...fontStyles) => ({ background: token, ...fontStyles.length > 0 && { fontStyles } })

const fg
  : (token: string, ...fontStyles: FontStyle[]) => Style
  = (token, ...fontStyles) => ({ foreground: token, ...fontStyles.length > 0 && { fontStyles } })

const border
  : (token: string, ...fontStyles: FontStyle[]) => Style
  = (token, ...fontStyles) => ({ border: token, ...fontStyles.length > 0 && { fontStyles } })

const text
  : (token: string, ...fontStyles: FontStyle[]) => Style
  = (token, ...fontStyles) => ({ color: token, ...fontStyles.length > 0 && { fontStyles } })

export const theme = {
  background: bg(spacemacs.bg1),
  foreground: fg(spacemacs.base),
  lineHighlightBackground: bg(spacemacs.bg2),
  selectionBackground: bg(spacemacs.act2),
  selectionHighlightBackground: bg(spacemacs['highlight-dim']),
  cursorForeground: fg(spacemacs.cursor),
  indentGuideBackground: bg(spacemacs['bg-alt']),
  border: border(spacemacs.border),
  lineNumberForeground: fg(spacemacs.border),
  builtInConstant: fg(spacemacs.const),
  userDefinedContant: fg(spacemacs.const),
  variable: fg(spacemacs.var),



  number: text(spacemacs.const),
  string: text(spacemacs.aqua),
  keyword: text(spacemacs.blue),
  className: text(spacemacs.blue),
  parameter: text(spacemacs.var),
  libraryFunction: text(spacemacs.func),
}

export const settings = {
  comment: {
    "scope": "comment",
    "settings": {
      "foreground": "#2AA1AE"
    }
  },
  string: {
    "scope": "string",
    "settings": {
      "foreground": "#2D9574"
    }
  },
  numeric: {
    "scope": "constant.numeric",
    "settings": {
      "foreground": "#4E3163"
    }
  },
  builtin: {
    "scope": "constant.language",
    "settings": {
      "foreground": "#4E3163"
    }
  },
  char: {
    "scope": [
      "constant.character",
      "constant.other"
    ],
    "settings": {
      "foreground": "#4E3163"
    }
  },
  var: {
    "scope": "variable",
    "settings": {
      "foreground": "#715AB1",
      "fontStyle": ""
    }
  },
  keyword: {
    "scope": "keyword",
    "settings": {
      "foreground": "#3A81C3",
    }
  },
  storage: {
    "scope": "storage",
    "settings": {
      "foreground": "#225588",
      "fontStyle": ""
    }
  },
  storageType: {
    "scope": "storage.type",
    "settings": {
      "foreground": "#6C3163",
      "fontStyle": "italic"
    }
  },
  class: {
    "scope": [
      "entity.name.class",
      "entity.name.type"
    ],
    "settings": {
      "foreground": "#3A81C3",
      "fontStyle": "bold"
    }
  },
  inherited: {
    "scope": "entity.other.inherited-class",
    "settings": {
      "foreground": "#3A81C3",
      "fontStyle": "italic underline"
    }
  },
  function: {
    "scope": "entity.name.function",
    "settings": {
      "foreground": "#6C3163",
      "fontStyle": ""
    }
  },
  functionBold: {
    "scope": "support.function",
    "settings": {
      "foreground": "#6C3163",
      "fontStyle": "bold"
    }
  },
  parameter: {
    "scope": "variable.parameter",
    "settings": {
      "foreground": "#715AB1",
      "fontStyle": ""
    }
  },
  tag: {
    "scope": "entity.name.tag",
    "settings": {
      "foreground": "#3A81C3",
      "fontStyle": ""
    }
  },
  attr: {
    "scope": "entity.other.attribute-name",
    "settings": {
      "foreground": "#6C3163",
      "fontStyle": ""
    }
  },
  const: {
    "scope": "support.constant",
    "settings": {
      "foreground": "#4E3163",
      "fontStyle": ""
    }
  },
  type: {
    "scope": [
      "support.type",
      "support.class"
    ],
    "settings": {
      "foreground": "#9966B8",
      "fontStyle": "italic"
    }
  },
  invalid: {
    "scope": "invalid",
    "settings": {
      "foreground": "#E0211D"
    }
  },
  diff: {
    "scope": [
      "meta.diff",
      "meta.diff.header"
    ],
    "settings": {
      "foreground": "#E0EDDD",
      "fontStyle": "italic"
    }
  },
  deleted: {
    "scope": "markup.deleted",
    "settings": {
      "foreground": "#DC322F"
    }
  },
  changed: {
    "scope": "markup.changed",
    "settings": {
      "foreground": "#CB4B16"
    }
  },
  inserted: {
    "scope": "markup.inserted",
    "settings": {
      "foreground": "#219186"
    }
  },
  quote: {
    "scope": "markup.quote",
    "settings": {
      "foreground": "#22AA44"
    }
  },
  bold: {
    "scope": [
      "markup.bold",
      "markup.italic"
    ],
    "settings": {
      "foreground": "#22AA44"
    }
  },
  italic: {
    "scope": [
      "markup.bold",
      "markup.italic"
    ],
    "settings": {
      "foreground": "#22AA44"
    }
  },
  inline: {
    "scope": "markup.inline.raw",
    "settings": {
      "foreground": "#9966B8"
    }
  },
  heading: {
    "scope": "markup.heading.setext",
    "settings": {
      "foreground": "#DDBB88"
    }
  },
  info: {
    "scope": "token.info-token",
    "settings": {
      "foreground": "#316BCD"
    }
  },
  warn: {
    "scope": "token.warn-token",
    "settings": {
      "foreground": "#CD9731"
    }
  },
  error: {
    "scope": "token.error-token",
    "settings": {
      "foreground": "#CD3131"
    }
  },
  debug: {
    "scope": "token.debug-token",
    "settings": {
      "foreground": "#800080"
    }
  }
} as const


/* 
     `(ac-completion-face ((,class (:underline t :foreground ,keyword))))
     `(ffap ((,class (:foreground ,base))))
     `(flx-highlight-face ((,class (:foreground ,comp :underline nil))))
     `(icompletep-determined ((,class :foreground ,keyword)))
     `(js2-external-variable ((,class (:foreground ,comp))))
     `(js2-function-param ((,class (:foreground ,const))))
     `(js2-jsdoc-html-tag-delimiter ((,class (:foreground ,str))))
     `(js2-jsdoc-html-tag-name ((,class (:foreground ,keyword))))
     `(js2-jsdoc-value ((,class (:foreground ,str))))
     `(js2-private-function-call ((,class (:foreground ,const))))
     `(js2-private-member ((,class (:foreground ,base))))
     `(js3-error-face ((,class (:underline ,war))))
     `(js3-external-variable-face ((,class (:foreground ,var))))
     `(js3-function-param-face ((,class (:foreground ,keyword))))
     `(js3-instance-member-face ((,class (:foreground ,const))))
     `(js3-jsdoc-tag-face ((,class (:foreground ,keyword))))
     `(js3-warning-face ((,class (:underline ,keyword))))

*/

