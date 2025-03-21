import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./NestedCheckbox.css";

interface CheckedYear {
  checked: boolean;
  childPeriods: Map<string, boolean> | undefined;
}

interface Props {
  allYears: string[];
  allPeriods: string[];
  allSummerSemesters: string[];
  monthRefs: Map<
    string,
    React.MutableRefObject<Map<string, HTMLDivElement> | null>
  >;
  checkHandler: (p: string, y: string) => void;
  checkedState: Map<string, CheckedYear>;
}

const NestedCheckbox = ({
  allYears,
  allPeriods,
  allSummerSemesters,
  monthRefs,
  checkHandler,
  checkedState,
}: Props) => {
  const [shownContent, _] = useState<Map<string, boolean>>(() => {
    const defaultShownContent = new Map<string, boolean>();
    allYears.forEach((y) => defaultShownContent.set(y, "2025" === "2025"));
    return defaultShownContent;
  });
  const today: Date = new Date();
  const [currYear, setCurrYear] = useState<string>(
    `${today.getFullYear()}`.slice(2)
  );

  const callback = (
    entries: IntersectionObserverEntry[],
    _: IntersectionObserver
  ) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      let entryId: string[] = entry.target.id.split("-");
      if (entry.isIntersecting) {
        // Item entering screen.
        setCurrYear(entryId[0].slice(2));
      }
    });
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-49% 0px -49% 0px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(callback, options);
    monthRefs.forEach((year) => {
      year.current?.forEach((ref) => {
        observer.observe(ref);
      });
    });
  }, []);

  // function buttonClickHandler(y: string) {
  //   const newShownContent = new Map<string, boolean>(shownContent);
  //   newShownContent.set(y, !newShownContent.get(y));
  //   setShownContent(newShownContent);
  // }

  return (
    <fieldset>
      <legend>Shown Categories:</legend>
      {allYears.map((y, i) => (
        <div key={i}>
          <ul style={{ display: y.includes(currYear) ? "block" : "none" }}>
            <div>
              <input
                type="checkbox"
                id={y}
                name={y}
                checked={checkedState.get(y)?.checked ?? true}
                onChange={() => checkHandler("", y)}
                style={{ display: "none" }}
              />
              <label
                className="year"
                htmlFor={y}
                style={{
                  color: checkedState.get(y)!.checked ? "white" : "gray",
                }}
              >
                <div className="year-collapsible">
                  {checkedState.get(y)!.checked ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                  {y}
                </div>
              </label>
              {/* <button
                type="button"
                style={{ display: "inline" }}
                onClick={() => buttonClickHandler(y)}
              >
                {" "}
                {shownContent.get(y) ? "^" : "v"}
              </button> */}
            </div>

            <div
              className="period-content"
              style={{ display: shownContent.get(y) ? "block" : "none" }}
            >
              {allPeriods.map((p, j) => (
                <li key={j}>
                  <input
                    type="checkbox"
                    id={`${y}${p}`}
                    name={`${y}${p}`}
                    checked={checkedState.get(y)?.childPeriods?.get(p) ?? true}
                    onChange={() => checkHandler(p, y)}
                    style={{ display: "none" }}
                  />
                  <div
                    style={{
                      color: checkedState.get(y)!.childPeriods!.get(p)
                        ? "white"
                        : "gray",
                    }}
                  >
                    {checkedState.get(y)!.childPeriods!.get(p) ? (
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{ fontSize: "13px " }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        style={{ fontSize: "13px " }}
                      />
                    )}
                    <label htmlFor={`${y}${p}`}>{p}</label>
                  </div>
                </li>
              ))}
            </div>
          </ul>
          <ul
            style={{
              display: allSummerSemesters[i].includes(currYear)
                ? "block"
                : "none",
            }}
          >
            <input
              type="checkbox"
              id={allSummerSemesters[i]}
              name={allSummerSemesters[i]}
              checked={checkedState.get(allSummerSemesters[i])?.checked ?? true}
              onChange={() => checkHandler("", allSummerSemesters[i])}
              style={{ display: "none" }}
            />
            <label className="summer" htmlFor={`${allSummerSemesters[i]}`}>
              <div
                className="year-collapsible"
                style={{
                  color: checkedState.get(allSummerSemesters[i])!.checked
                    ? "white"
                    : "gray",
                }}
              >
                {checkedState.get(allSummerSemesters[i])!.checked ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
                {`${allSummerSemesters[i]}`}
              </div>
            </label>
          </ul>
        </div>
      ))}
    </fieldset>
  );
};

export default NestedCheckbox;
