/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
  AfterSelector: 2,
  InsideSelector: 3,
  AfterPropertyName: 4,
  AfterPropertyNameAfterColon: 5,
  InsideBlockComment: 7,
  InsidePseudoSelector: 8,
  InsideAttributeSelector: 9,
  AfterQuery: 10,
  InsideRound: 11,
  AfterQueryWithRules: 12,
  InsideRule: 13,
  AfterFunctionName: 14,
  InsideDoubleQuoteString: 15,
  InsideSingleQuoteString: 16,
  AfterFunctionNameInsideArguments: 17,
  AfterKeywordImport: 18,
}

export const StateMap = {
  [State.TopLevelContent]: 'TopLevelContent',
  [State.AfterSelector]: 'AfterSelector',
  [State.InsideSelector]: 'InsideSelector',
  [State.AfterPropertyName]: 'AfterPropertyName',
  [State.AfterPropertyNameAfterColon]: 'AfterPropertyNameAfterColon',
}

/**
 * @enum number
 */
export const TokenType = {
  CssSelector: 1,
  Whitespace: 2,
  Punctuation: 3,
  CssPropertyName: 4,
  CssPropertyValue: 5,
  CurlyOpen: 6,
  CurlyClose: 7,
  PropertyColon: 8,
  CssPropertySemicolon: 9,
  Variable: 10,
  None: 57,
  Unknown: 881,
  CssPropertyColon: 882,
  Numeric: 883,
  NewLine: 884,
  Comment: 885,
  Query: 886,
  Text: 887,
  CssSelectorId: 889,
  FuntionName: 890,
  String: 891,
  KeywordImport: 892,
  CssSelectorClass: 893,
}

export const TokenMap = {
  [TokenType.CssSelector]: 'CssSelector',
  [TokenType.Whitespace]: 'Whitespace',
  [TokenType.Punctuation]: 'Punctuation',
  [TokenType.CssPropertyName]: 'CssPropertyName',
  [TokenType.CssPropertyValue]: 'CssPropertyValue',
  [TokenType.CurlyOpen]: 'Punctuation',
  [TokenType.CurlyClose]: 'Punctuation',
  [TokenType.PropertyColon]: 'Punctuation',
  [TokenType.CssPropertySemicolon]: 'Punctuation',
  [TokenType.Variable]: 'VariableName',
  [TokenType.None]: 'None',
  [TokenType.CssPropertyValue]: 'CssPropertyValue',
  [TokenType.Unknown]: 'Unknown',
  [TokenType.CssPropertyColon]: 'Punctuation',
  [TokenType.Numeric]: 'Numeric',
  [TokenType.NewLine]: 'NewLine',
  [TokenType.Comment]: 'Comment',
  [TokenType.Query]: 'CssAtRule',
  [TokenType.Text]: 'Text',
  [TokenType.CssSelectorId]: 'CssSelectorId',
  [TokenType.FuntionName]: 'Function',
  [TokenType.String]: 'String',
  [TokenType.KeywordImport]: 'KeywordImport',
  [TokenType.CssSelectorClass]: 'CssSelectorClass',
}

const RE_SELECTOR = /^[\.a-zA-Z\d\-\:>\+\~\_%\\]+/
const RE_SELECTOR_ID = /^#[\w\-\_]+/
const RE_SELECTOR_CLASS = /^\.[\w\-\_]+/
const RE_WHITESPACE = /^\s+/
const RE_CURLY_OPEN = /^\{/
const RE_CURLY_CLOSE = /^\}/
const RE_PROPERTY_NAME = /^[a-zA-Z\-\w]+/
const RE_COLON = /^:/
const RE_PROPERTY_VALUE = /^[^;\}]+/
const RE_PROPERTY_VALUE_SHORT = /^[^;\}\s\)]+/
const RE_PROPERTY_VALUE_INSIDE_FUNCTION = /^[^\}\s\)]+/
const RE_SEMICOLON = /^;/
const RE_COMMA = /^,/
const RE_ANYTHING = /^.+/s
const RE_NUMERIC = /^\-?(([0-9]+\.?[0-9]*)|(\.[0-9]+))/
const RE_ANYTHING_UNTIL_CLOSE_BRACE = /^[^\}]+/
const RE_BLOCK_COMMENT_START = /^\/\*/
const RE_BLOCK_COMMENT_END = /^\*\//
const RE_BLOCK_COMMENT_CONTENT = /^.+?(?=\*\/|$)/s
const RE_ROUND_OPEN = /^\(/
const RE_ROUND_CLOSE = /^\)/
const RE_PSEUDO_SELECTOR_CONTENT = /^[^\)]+/
const RE_SQUARE_OPEN = /^\[/
const RE_SQUARE_CLOSE = /^\]/
const RE_ATTRIBUTE_SELECTOR_CONTENT = /^[^\]]+/
const RE_QUERY = /^@[a-z\-]+/
const RE_STAR = /^\*/
const RE_QUERY_NAME = /^[a-zA-Z\w\-\d\_]+/
const RE_QUERY_CONTENT = /^[^\)]+/
const RE_COMBINATOR = /^[\+\>\~]/
const RE_FUNCTION = /^[a-zA-Z][a-zA-Z\-]+(?=\()/
const RE_VARIABLE_NAME = /^\-\-[a-zA-Z\w\-\_]+/
const RE_PERCENT = /^\%/
const RE_OPERATOR = /^[\-\/\*\+]/
const RE_DOUBLE_QUOTE = /^"/
const RE_STRING_DOUBLE_QUOTE_CONTENT = /^[^"]+/
const RE_STRING_SINGLE_QUOTE_CONTENT = /^[^']+/
const RE_SINGLE_QUOTE = /^'/
const RE_ANYTHING_BUT_CURLY = /^[^\{\}]+/s

export const initialLineState = {
  state: State.TopLevelContent,
  tokens: [],
  stack: [],
}

/**
 * @param {any} lineStateA
 * @param {any} lineStateB
 */
export const isEqualLineState = (lineStateA, lineStateB) => {
  return lineStateA.state === lineStateB.state
}

export const hasArrayReturn = true

/**
 * @param {string} line
 * @param {any} lineState
 */
export const tokenizeLine = (line, lineState) => {
  let next = null
  let index = 0
  let tokens = []
  let token = TokenType.None
  let state = lineState.state
  const stack = lineState.stack
  while (index < line.length) {
    const part = line.slice(index)
    switch (state) {
      case State.TopLevelContent:
        if ((next = part.match(RE_ANYTHING))) {
          token = TokenType.Text
          state = State.TopLevelContent
        } else {
          throw new Error('no')
        }
        break
      default:
        console.log({ state, line })
        throw new Error('no')
    }
    const tokenLength = next[0].length
    index += tokenLength
    tokens.push(token, tokenLength)
  }
  if (state === State.AfterPropertyName) {
    state = State.InsideSelector
  }
  return {
    state,
    tokens,
    stack,
  }
}
