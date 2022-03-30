import Filter from "bad-words";
import badWordList from "./badWordList";
import excludeBadWordList from "./excludeBadWordList";

const filter = new Filter();

filter.addWords(...badWordList);

export const badWordFilter = (string) => {
  string = string.toLowerCase();
  return (
    filter.list.filter(
      (word) => string.includes(word) && !excludeBadWordList.includes(word)
    ).length > 0 || false
  );
};

export const cleanBadWord = (string, hide) => {
  string = !hide ? string.toLowerCase() : string;
  return !hide
    ? filter.list.reduce((s, w) => s.split(w).join("*****"), string)
    : string;
};
