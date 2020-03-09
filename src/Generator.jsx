import React, { useState, useRef, useEffect, useCallback } from "react";
import { generatePassword } from "./funx";

// Range Slider Properties
const MIN_PASSWORD_LENGTH = "4";
const MAX_PASSWORD_LENGTH = "32";
const DEFAULT_PASSWORD_LENGTH = "8";
// Fill : The trailing color that you see when you drag the slider.
// background : Default Range Slider Background
const sliderProps = {
  fill: "#0B1EDF",
  background: "rgba(255, 255, 255, 0.214)"
};

export default function PasswordGenerator() {
  const [result, setResult] = useState("");
  const [copied, setCopiedState] = useState(false);
  const [state, setState] = useState({
    length: DEFAULT_PASSWORD_LENGTH,
    hasLower: true,
    hasUpper: true,
    hasNumber: true,
    hasSymbol: false
  });

  const sliderRef = useRef();
  const resultContainer = useRef();
  const copyBtn = useRef();
  // Text info showed after generate button is clicked
  const copyInfo = useRef();
  // Text appear after copy button is clicked
  const copiedInfo = useRef();

  function applyFill(ref) {
    const slider = ref.current;
    if (slider) {
      const length = slider.value;
      const percentage =
        (100 * (length - MIN_PASSWORD_LENGTH)) /
        (MAX_PASSWORD_LENGTH - MIN_PASSWORD_LENGTH);

      slider.style.background = `linear-gradient(90deg, ${
        sliderProps.fill
      } ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`;

      setState(state => ({ ...state, length }));
    }
  }

  // Update Css Props of the COPY button
  // Getting the bounds of the result viewbox container
  const resultContainerBound = useRef({
    left: resultContainer.current?.getBoundingClientRect().left,
    top: resultContainer.current?.getBoundingClientRect().top
  });

  // on mount
  useEffect(() => {
    window.addEventListener("resize", e => {
      resultContainerBound.current = {
        left: resultContainer.current.getBoundingClientRect().left,
        top: resultContainer.current.getBoundingClientRect().top
      };
    });

    // This will update the position of the copy button based on mouse Position
    resultContainer.current.addEventListener("mousemove", e => {
      resultContainerBound.current = {
        left: resultContainer.current.getBoundingClientRect().left,
        top: resultContainer.current.getBoundingClientRect().top
      };
      copyBtn.current.style.setProperty(
        "--x",
        `${e.x - resultContainerBound.current.left}px`
      );
      copyBtn.current.style.setProperty(
        "--y",
        `${e.y - resultContainerBound.current.top}px`
      );
    });
    // Selecting the range input and passing it in the applyFill func.
    applyFill(sliderRef);
  }, []);

  // Copy Password in clipboard
  function handleCopyBtnClick() {
    const textarea = document.createElement("textarea");
    const password = result;
    if (!password || password === "CLICK GENERATE") {
      return;
    }
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();

    copyInfo.current.style.transform = "translateY(200%)";
    copyInfo.current.style.opacity = "0";
    copiedInfo.current.style.transform = "translateY(0%)";
    copiedInfo.current.style.opacity = "0.75";
  }

  // When Generate is clicked Password id generated.
  function handleGenerateBtnClick() {
    const { length, hasLower, hasUpper, hasNumber, hasSymbol } = state;
    const pswd = generatePassword(
      Number(length),
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol
    );
    setResult(pswd);
    copyInfo.current.style.transform = "translateY(0%)";
    copyInfo.current.style.opacity = "0.75";
    copiedInfo.current.style.transform = "translateY(200%)";
    copiedInfo.current.style.opacity = "0";
  }

  function handlePswdLengthChange(event) {
    applyFill(sliderRef);
  }

  function handleSettingChange(setting) {
    return () =>
      setState(prevState => ({ ...prevState, [setting]: !prevState[setting] }));
  }

  return (
    <div className="container">
      <h2 className="title">Password Generator</h2>
      <div className="result" ref={resultContainer}>
        <div className="result__title field-title">Generated Password</div>
        <div className="result__info right" ref={copyInfo}>
          click to copy
        </div>
        <div className="result__info left" ref={copiedInfo}>
          copied
        </div>
        <div className="result__viewbox" id="result">
          {result || "CLICK GENERATE"}
        </div>
        <button
          id="copy-btn"
          style={{ "--x": 0, "--y": 0 }}
          onClick={handleCopyBtnClick}
          ref={copyBtn}
        >
          <i className="far fa-copy" />
        </button>
      </div>
      <div className="length range__slider">
        <div className="length__title field-title">length: {state.length}</div>
        <input
          id="slider"
          type="range"
          min={MIN_PASSWORD_LENGTH}
          max={MAX_PASSWORD_LENGTH}
          value={state.length}
          onChange={handlePswdLengthChange}
          ref={sliderRef}
        />
      </div>

      <div className="settings">
        <span className="settings__title field-title">settings</span>
        <div className="setting">
          <input
            type="checkbox"
            id="uppercase"
            checked={state.hasUpper}
            onChange={handleSettingChange("hasUpper")}
          />
          <label htmlFor="uppercase">Include Uppercase</label>
        </div>
        <div className="setting">
          <input
            type="checkbox"
            id="lowercase"
            checked={state.hasLower}
            onChange={handleSettingChange("hasLower")}
          />
          <label htmlFor="lowercase">Include Lowercase</label>
        </div>
        <div className="setting">
          <input
            type="checkbox"
            id="number"
            checked={state.hasNumber}
            onChange={handleSettingChange("hasNumber")}
          />
          <label htmlFor="number">Include Numbers</label>
        </div>
        <div className="setting">
          <input
            type="checkbox"
            id="symbol"
            checked={state.hasSymbol}
            onChange={handleSettingChange("hasSymbol")}
          />
          <label htmlFor="symbol">Include Symbols</label>
        </div>
      </div>

      <button
        className="btn generate"
        id="generate"
        onClick={handleGenerateBtnClick}
      >
        Generate Password
      </button>
    </div>
  );
}
