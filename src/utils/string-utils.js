export class StringUtils {
  static capitalize(word) {
    const tokens = word.split(" ");
    const words = tokens.map((token) => this._capitalize(token));
    return words.join(" ");
  }

  static _capitalize(str) {
    if (!str) {
      return "";
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
