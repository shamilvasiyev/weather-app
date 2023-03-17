import classes from "./App.module.css";
import { BsSearch } from "@react-icons/all-files/bs/BsSearch";

const Search = (props) => {
  return (
    <div className={classes.search_bar}>
      <input
        type="text"
        placeholder="Search your city"
        onChange={props.onChanceInput}
        value={props.inputValue}
      />
      <button onClick={props.onClickButton}>
        <BsSearch />
      </button>
    </div>
  );
};
export default Search;
