import React, { useState, useRef, useEffect, useContext } from "react";
import { pdfjs } from "react-pdf";
import MyContext from "../../Provider/MyContext";
import "./PDFProcessor.css";
import PopupMultipleBtn from "../../components/Popups/PopupMultipleBtn/PopupMultipleBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";
import ChapterPopUp from "../../components/Popups/ChapterPopUp/ChapterPopUp";
import TopBar from "../../components/TopBar/TopBar";
import Dialog from "../../components/Dialog/Dialog";
import Charakter from "../../components/Character/Character";
import iconImage from "../../assets/icons/icon-addFile.png";
import Fragens from "../Questions/Questions";
import { franc } from "franc";
import PopupWarning from "../../components/Popups/PopupWarning/PopupWarning";
import { useTranslation } from "react-i18next";
import ModePopup from "../../components/Popups/ModePopup.js/ModePopup";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFProcessor = ({
  onPDFUploaded,
  scenes,
  setScenes,
  setActiveItem,
  setGeneration,
  setVideo,
  setTitle,
  title,
}) => {
  const [showZoomButtons, setShowZoomButtons] = useState(true);
  const [pdfData, setPdfData] = useState(null);
  const {
    chapters,
    setChapters,
    myScenes,
    setMyScenes,
    clickedScene,
    setBlockProcess,
    setProcessOn,
    storedPdfData,
    setStoredPdfData,
    storedCanvasContent,
    setStoredCanvasContent,
    previousSkript,
    storedSelectedPage,
    setStoredSelectedPage,
    scale,
    setScale,
    newSlectionExist,
    setMode,
    setautoModeChapters,
    setNewSelectionExist,
    setFragenUpdatedAfterSelection,
    setVisitedSections,
    setChargedScenes,
    selectedText,
    setSelectedText,
    textLanguage,
    setTextLanguage,
    pdfError,
    setPdfError,
    clickedType,
    setIsErrorOccured,
    mode
    
  } = useContext(MyContext);

  const [zoomused,setZoomUsed]= useState(false)
  const [disableZoom,setDisableZoom]= useState(false)
  const [chapterTitle, setChapterTitle] = useState('');
  const [isDrawingRectangle, setIsDrawingRectangle] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectionStartTimestamp, setSelectionStartTimestamp] = useState(null);
  const [clearOverlay, setClearOverlay] = useState(false);
  const [showMyModal, setShowMyModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(false);
  const [deleteAction, setDeleteAction] = useState(false);
  const [back, setBack] = useState(false);
  const [pdf2, setPdf2] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [recievedResponse, setRecievdResponse] = useState(null);
  const [automaticModeLoading, setAutomaticModeLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStartX, setSelectionStartX] = useState(0);
  const [selectionStartY, setSelectionStartY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pdfDisplayed, setPdfDisplayed] = useState(false);
  const [showPopupMode, setShowPopupMode] = useState(false);
  const [selectedPageNumber, setSelectedPageNumber] = useState(1);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const { t } = useTranslation();
  const items =
    clickedType === "textReader"
      ? ["Skript", "Charakter"]
      : ["Skript", "Dialog", "Fragen", "Charakter"];

  let result 

  useEffect(() => {
    console.log("-----------------pdfError value is----------------", pdfError);
  }, [pdfError]);

  const fetchData = async () => {
    if (storedPdfData) {
      try {
        const data = await readPDF(storedPdfData);
        setPdfData(data);
        mode=== "Manual Mode" ? setShowPopupMode(false) : setShowPopupMode(true);


        onPDFUploaded();
        displayPDF(data, scale).then(() => {
          storedCanvasContent.forEach(({ newPage, rect }) => {
            drawStoredTriangleOnPage(newPage, rect, scale);
          });
        });
        setBack(true);
      } catch (error) {
        console.error("Error reading PDF:", error);
      }
    }
  };

  useEffect(() => {
    if (newSlectionExist) {
      console.log("newSlectionExist is true");
    } else {
      console.log("newSlectionExist is false");
    }
  }, [newSlectionExist]);

  const handleBackToSkript = () => {
    setPdfError(false);
    setMode('Manual mode');
    setShowPopupMode(false);

    fetchData();
    setMyScenes([]);
    setScenes([]);
    setChapters([]);
    setIsErrorOccured(true);
    setVisitedSections(["Skirpt"]);
  };

  const handleConfirmMode = async () => {
    setMode("Automatic Mode");
    setAutomaticModeLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      console.log("sending request before 1111");
      const response = await fetch("http://127.0.0.1:5000/api/upload_pdf", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setAutomaticModeLoading(false);
      const detectedLanguage = franc(data.result[0].text);
      console.log(
        "___________________________detected______________",
        detectedLanguage
      );
      switch (detectedLanguage) {
        case "eng":
          setTextLanguage("en-US");
          break;
        case "deu":
          setTextLanguage("de-DE");
          break;
        case "fra":
          setTextLanguage("fr-FR");
          break;
        case "arb":
          setTextLanguage("ar-XA");
          break;
        default:
          setTextLanguage("");
      }
      const mappedChapters = data.result.map((chapter) => ({
        title: chapter.title,
        softContent: chapter.text,
        content: chapter.text,
        status: "undone",
      }));
      setRecievdResponse(mappedChapters);
      setautoModeChapters(mappedChapters);
      console.log("------------auto mode chapters-----------------", mappedChapters);

      setMessage(data.message.result);
    } catch (error) {
      setMessage("An error occurred while uploading the file.");
    }
  };
  const drawStoredTriangleOnPage = (pageNumber, rect, scaleVal) => {
    const pdfPageCanvasList = document.querySelectorAll("#pdfContainer canvas");
    const pageCanvas = pdfPageCanvasList[pageNumber - 1];

    if (!pageCanvas) return;

    const context = pageCanvas.getContext("2d", { willReadFrequently: true });
    const coordData = {
      x: rect.x * scaleVal,
      y: rect.y * scaleVal,
      width: rect.width * scaleVal,
      height: rect.height * scaleVal,
    };

    context.beginPath();
    context.rect(coordData.x, coordData.y, coordData.width, coordData.height);
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.setLineDash([5, 5]);
    context.stroke();
  };

  const handleConfirm = () => {
    console.log(
      "-----------------Selected text------------------",
      selectedText
    );
    const detectedLanguage = franc(selectedText);
    console.log(
      "___________________________detected______________",
      detectedLanguage
    );
    switch (detectedLanguage) {
      case "eng":
        setTextLanguage("en-US");
        break;
      case "deu":
        setTextLanguage("de-DE");
        break;
      case "fra":
        setTextLanguage("fr-FR");
        break;
      case "arb":
        setTextLanguage("ar-XA");
        break;
      default:
        setTextLanguage("");
    }

    if (scenes && scenes.length > 0) {
      try {
        const existingContent = chapters.find(
          (item) =>
            item.title === chapterTitle &&
            item.sceneTitle === clickedScene.sceneTitle &&
            item.sceneLocation === clickedScene.sceneLocation
        );
        if (existingContent) {
          setChapters((prevSceneContent) => {
            const updatedChapters = prevSceneContent.map((item) =>
              item.title === chapterTitle &&
              item.sceneTitle === clickedScene.sceneTitle &&
              item.sceneLocation === clickedScene.sceneLocation
                ? {
                    title: chapterTitle,
                    content: item.content + selectedText,
                    sceneTitle: clickedScene.sceneTitle,
                    sceneLocation: clickedScene.sceneLocation,
                  }
                : item
            );
            if (updatedChapters.length > 0) {
              setBlockProcess(false);
            }
            return updatedChapters;
          });
        } else {
          setChapters([
            ...chapters,
            {
              title: chapterTitle,
              content: selectedText,
              sceneTitle: clickedScene.sceneTitle,
              sceneLocation: clickedScene.sceneLocation,
            },
          ]);
          setBlockProcess(false);
        }

        const existingDataIndex = myScenes.findIndex(
          (item) =>
            item.sceneTitle === clickedScene.sceneTitle &&
            item.sceneLocation === clickedScene.sceneLocation
        );

        if (existingDataIndex !== -1) {
          const existingChapterIndex = myScenes[
            existingDataIndex
          ].sceneChapters.findIndex(
            (chapter) => chapter.title === chapterTitle
          );

          if (existingChapterIndex !== -1) {
            setChargedScenes((prev_scenes) => {
              return prev_scenes.map((item) => {
                if (item.sceneName === myScenes[existingDataIndex].sceneTitle) {
                  const updatedChargedChapters = item.chargedChapters.filter(
                    (chapter) =>
                      chapter !==
                      myScenes[existingDataIndex].sceneChapters[
                        existingChapterIndex
                      ].title
                  );

                  return {
                    ...item,
                    chargedChapters: updatedChargedChapters,
                  };
                } else {
                  return item;
                }
              });
            });

            setMyScenes((prevData) => {
              return prevData.map((item, index) => {
                if (index === existingDataIndex) {
                  const prevcontentOfChapter = chapters.find(
                    (item) =>
                      item.title === chapterTitle &&
                      item.sceneTitle === clickedScene.sceneTitle &&
                      item.sceneLocation === clickedScene.sceneLocation
                  );
                  return {
                    ...item,
                    sceneChapters: item.sceneChapters.map(
                      (chapter, chapterIndex) =>
                        chapterIndex === existingChapterIndex
                          ? {
                              ...chapter,
                              content: chapter.content,
                              softContent:
                                prevcontentOfChapter.content + selectedText,
                              status: (chapter.status = "undone"),
                            }
                          : chapter
                    ),
                  };
                } else {
                  return item;
                }
              });
            });
            setChargedScenes((prevChargedScenes) => {
              return prevChargedScenes.map((chargedScene) => {
                if (chargedScene.scenetitle === clickedScene.sceneTitle) {
                  return {
                    ...chargedScene,
                    chargedChapters: chargedScene.chargedChapters.filter(
                      (chargedChapter) =>
                        chargedChapter.title !== chapterTitle &&
                        chargedChapter.status !== "undone"
                    ),
                  };
                } else {
                  return chargedScene;
                }
              });
            });
          } else {
            setMyScenes((prevData) => {
              return prevData.map((item, index) => {
                if (index === existingDataIndex) {
                  return {
                    ...item,
                    sceneChapters: [
                      ...item.sceneChapters.map((chap, chapIndex) => {
                        return {
                          title: chap.title,
                          content: chap.content,
                          softContent: chap.softContent,

                          position: chapIndex === 0 ? "first" : "middle",
                          status: chap.status ? chap.status : "undone",
                        };
                      }),
                      {
                        title: chapterTitle,
                        content: selectedText,
                        position: "last",
                        status: "undone",
                        softContent: selectedText,
                      },
                    ],
                  };
                } else {
                  return item;
                }
              });
            });
          }
        } else {
          setMyScenes((prevData) => {
            return [
              ...prevData,
              {
                sceneTitle: clickedScene.sceneTitle,
                sceneLocation: clickedScene.sceneLocation,
                sceneChapters: [
                  {
                    title: chapterTitle,
                    content: selectedText,
                    softContent: selectedText,
                    position: "first&last",
                    status: "undone",
                  },
                ],
              },
            ];
          });
        }

        if (previousSkript) {
          setNewSelectionExist(true);
          setFragenUpdatedAfterSelection(true);
        }
      } catch (error) {
        console.error("Error performing OCR:", error);
      }
      drawRectangleOnPage(selectedPageNumber);
    }

    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      overlayCanvasRef.current = null;
      overlayCanvas.remove();
      setShowZoomButtons(true);
      setBlockProcess(false);
    }
  };

  const handleDelete = () => {
    const overlayCanvas = overlayCanvasRef.current;
    if (overlayCanvas) {
      overlayCanvasRef.current = null;
      overlayCanvas.remove();
      setClearOverlay(false);
      console.log(clearOverlay);
      setShowZoomButtons(true);
    }
  };

  useEffect(() => {
    const chapNumber = 0;
    myScenes.map((scene) => {
      chapNumber += scene.sceneChapters.length;
    });
    if (chapNumber === 0) {
      setBlockProcess(true);
    }
  }, []);

  useEffect(() => {
    if (showPopupMode) {
      console.log("showPopupMode is true");
    } else {
      console.log("showPopupMode is true");
    }
  }, [showPopupMode]);

  useEffect(() => {
    if (confirmAction) {
      handleConfirm();
      setConfirmAction(false);
    }
  }, [confirmAction]);

  useEffect(() => {
    if (deleteAction) {
      handleDelete();
      setDeleteAction(false);
    }
  }, [deleteAction]);

  const handleOpenMyModal = async () => {
    if (clickedScene) {
      result = await CaptureRectangleScreenShot(selectedPageNumber);
      console.log("------------------result here------------------ ", result);
      if (result) {
        setShowMyModal(true);
      } else {
        const overlayCanvas = overlayCanvasRef.current;
        if (overlayCanvas) {
          overlayCanvasRef.current = null;
          overlayCanvas.remove();
          setClearOverlay(false);
          console.log(clearOverlay);
          setShowZoomButtons(true);
        }
        const pdfContainer = document.getElementById("pdfContainer");
        pdfContainer.style.position = "relative";
        return { result: "ok" };
      }
    }
    setClearOverlay(false);
    setClearOverlay(false);
    setIsDrawingRectangle(false);
    console.log(isDrawingRectangle);
    const pdfContainer = document.getElementById("pdfContainer");
    pdfContainer.style.position = "static";
  };

  const handleCloseMyModal = () => {
    setShowMyModal(false);
    const pdfContainer = document.getElementById("pdfContainer");
    pdfContainer.style.position = "relative";
    return { result: "ok" };
  };

  async function readPDF(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async function displayPDF(pdfData, scaleVal) {
    setDisableZoom(true);

    return new Promise(async (resolve, reject) => {
      try {
        const pdfContainer = document.getElementById("pdfContainer");
        pdfContainer.innerHTML = "";

        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
        setPdf2(pdf);
        const numPages = pdf.numPages;

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const container = document.createElement("div");
          container.className = "pdf-page-container";

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d", { willReadFrequently: true });
          const viewport = page.getViewport({ scale: scaleVal });

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport,
          };
          await page.render(renderContext);

          container.appendChild(canvas);
          pdfContainer.appendChild(container);

          if (pageNumber === storedSelectedPage) {
            pdfContainer.scrollTop = container.offsetTop;
          }
        }
        setDisableZoom(false);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  const closePopupMode = () => {
    setShowPopupMode(false);
  };

  const handlePDFInputChange = async (event) => {
    try {
      const file = event.target.files[0];

      if (file && file.type === "application/pdf") {
        const data = await readPDF(file);
        localStorage.setItem("storedPdf", data);
        setStoredPdfData(file);
        setFile(file);

        setPdfData(data);
        onPDFUploaded();
        displayPDF(data, 1).then(() => {
          setPdfDisplayed(true);
          setShowPopupMode(true);
        });
      } else {
        console.error("Invalid file format. Please select a PDF file.");
      }
    } catch (err) {
      console.error("Error during file upload:", err);
    }
  };

  const createOverlayCanvas = () => {
    const pdfContainer = document.getElementById("pdfContainer");
    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.top = "0";
    overlayCanvas.style.left = "0";
    overlayCanvas.width = pdfContainer.clientWidth * 1.2;
    overlayCanvas.height = pdfContainer.clientHeight;
    overlayCanvasRef.current = overlayCanvas;
    pdfContainer.appendChild(overlayCanvas);
  };

  const [hasMouseMoved, setHasMouseMoved] = useState(false);

  const handleMouseDown = (event) => {
    setShowZoomButtons(false);

    setWidth(0);
    setHeight(0);
    setHasMouseMoved(false);
    const pdfContainer = document.getElementById("pdfContainer");
    pdfContainer.style.position = "static";

    createOverlayCanvas();
    const pdfPageCanvasList = document.querySelectorAll("#pdfContainer canvas");
    for (let i = 0; i < pdfPageCanvasList.length; i++) {
      const pdfPageCanvas = pdfPageCanvasList[i];
      const rect = pdfPageCanvas.getBoundingClientRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        setSelectedPageNumber(i + 1);
        setSelectionStartX(event.clientX);
        setSelectionStartY(event.clientY);
        setIsSelecting(true);
        break;
      }
    }
    setSelectionStartTimestamp(new Date().getTime());
    localStorage.setItem("storedPage", selectedPageNumber);
  };

  const handleMouseMove = (event) => {
    if (isSelecting) {
      const currentX = event.clientX;
      const currentY = event.clientY;
      if (
        Math.abs(currentX - selectionStartX) > 20 &&
        Math.abs(currentY - selectionStartY) > 20
      ) {
        setWidth(Math.abs(currentX - selectionStartX));
        setHeight(Math.abs(currentY - selectionStartY));
        setHasMouseMoved(true);
      }
      const overlayCanvas = overlayCanvasRef.current;
      if (overlayCanvas && scenes && scenes.length > 0) {
        const context = overlayCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (clickedScene.length !== 0) {
          context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          context.beginPath();
          context.rect(selectionStartX, selectionStartY, width, height);
          context.lineWidth = 2;
          context.strokeStyle = "black";
          context.setLineDash([5, 5]);
          context.stroke();
        }
      }
    }
  };

  const handleMouseUp = () => {
    setShowZoomButtons(false);

    const pdfContainer = document.getElementById("pdfContainer");
    pdfContainer.style.position = "relative";
    const selectionEndTimestamp = new Date().getTime();

    const clickDuration = selectionEndTimestamp - selectionStartTimestamp;
    if (isSelecting && selectedPageNumber !== null) {
      setIsSelecting(false);
      if (hasMouseMoved && clickedScene) {
        handleOpenMyModal();
      } else if (clickDuration > 200) {
        setShowWarning(true);
        setTimeout(() => {
          setShowWarning(false);
          setShowZoomButtons(true);
        }, 1000);
      } else {
      }
    }
  };

  const drawRectangleOnPage = (pageNumber) => {
    console.log("page Number in drawRectangleOnPage", pageNumber);
    const page = pageNumber - 1;
    const pdfPageCanvasList = document.querySelectorAll("#pdfContainer canvas");
    const pageCanvas = pdfPageCanvasList[page];

    if (!pageCanvas) return;

    const context = pageCanvas.getContext("2d", { willReadFrequently: true });

    const canvasRect = pageCanvas.getBoundingClientRect();
    const rectX = selectionStartX - canvasRect.left;
    const rectY = selectionStartY - canvasRect.top;
    context.beginPath();
    context.rect(rectX, rectY, width, height);
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.setLineDash([5, 5]);
    context.stroke();

    const newPage = back || zoomused ? pageNumber : page;

    setStoredCanvasContent((prevContent) => {
      return [
        ...prevContent,
        {
          newPage,
          rect: {
            x: rectX / scale,
            y: rectY / scale,
            width: width / scale,
            height: height / scale,
          },
        },
      ];
    });
    setStoredSelectedPage(newPage);
  };

  const CaptureRectangleScreenShot = (pageNumber) => {
    const pdfPageCanvasList = document.querySelectorAll("#pdfContainer canvas");
    const pageCanvas = pdfPageCanvasList[pageNumber - 1];
    let res;
    if (!pageCanvas) return;
    const canvasRect = pageCanvas.getBoundingClientRect();
    const rectX = selectionStartX - canvasRect.left;
    const rectY = selectionStartY - canvasRect.top;
    if (width > 20 && height > 20) {
      res = extractTextFromRectangle(pageNumber, rectX, rectY, width, height);
    }
    setTimeout(() => {
      setIsDrawingRectangle(false);
    }, 0);
    return res;
  };

  const handleChapterTitle = (title) => {
    setChapterTitle(title);
  };

  const concatText = (phrases) => {
    let resultedText = "";
    for (let i = 0; i < phrases.length; i++) {
      if (phrases[i].str === "-" && phrases[i + 1]?.str === "") {
        i++;
      } else if (phrases[i].str === "") {
        resultedText += " ";
      } else {
        resultedText += phrases[i].str;
      }
    }
    return resultedText;
  };

  const extractTextFromRectangle = async (pageNumber, x, y, width, height) => {
    setIsLoading(true);

    try {
      const page = await pdf2.getPage(
        previousSkript || zoomused ? pageNumber : pageNumber - 1
      );
      const viewport = page.getViewport({ scale: scale });
      const scaled_Y = (viewport.height - y) / scale;
      const scaled_X = x / scale;
      const textContent = await page.getTextContent();
      const itemsInsideRectangle = textContent.items.filter((item) => {
        return (
          item.transform[4] >= scaled_X &&
          item.transform[4] <= scaled_X + width &&
          item.transform[5] <= scaled_Y &&
          item.transform[5] >= scaled_Y - height / scale
        );
      });
      let resultedText = concatText(itemsInsideRectangle);

      setSelectedText(resultedText);
      console.log("resultedText : ", resultedText);
      return resultedText;
    } catch (error) {
      setShowWarning(true);
    } finally {
      if (selectedText.length !== 0) {
        setIsLoading(false);
      }
    }
  };

  const [responseData, setResponseData] = useState("");
  const [selectedItem, setSelectedItem] = useState("Skript");




useEffect(()=>{
console.log("mode :",mode)
  
},[mode])


  const Zoom_plus = async () => {
    setZoomUsed(true);
    const data = await readPDF(storedPdfData);
    setScale((prevVal) => {
      console.log("plus prevVal", prevVal);
      return prevVal + 1;
    });
    displayPDF(data, scale + 1).then(() => {
      storedCanvasContent.forEach(({ newPage, rect }) => {
        console.log(`Drawing on page ${newPage}`, storedCanvasContent);
        drawStoredTriangleOnPage(newPage, rect, scale + 1);
      });
    });
  };

  const Zoom_moins = async () => {
    setZoomUsed(true);
    const data = await readPDF(storedPdfData);
    setScale((prevVal) => {
      console.log("prevVal here", prevVal);
      return Math.max(1, prevVal - 1);
    });
    displayPDF(data, Math.max(1, scale - 1)).then(() => {
      storedCanvasContent.forEach(({ newPage, rect }) => {
        console.log(`Drawing on page ${newPage}`, storedCanvasContent);
        drawStoredTriangleOnPage(newPage, rect, Math.max(1, scale - 1));
      });
    });
  };

  let content;
  if (selectedItem === "Skript") {
    setActiveItem("Skript");
    setProcessOn(true);
    content = (
      <div
        id="pdfContainer"
        className="h-100"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          overflowY: "auto",
          margin: "10px 0 0 10px ,",
          marginRight: "5px",
          width: "100%",
          textAlign: "center",
          zIndex: 2,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {pdfData && (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: "18vh",
              left: "13%",
              width: 0,
              zIndex: 1,
            }}
          />
        )}
      </div>
    );
  } else if (selectedItem === "Dialog") {
    console.log("-------------------jet l dialog--------------------");
    setActiveItem("Dialog");
    content = (
      <Dialog responseData={responseData} setResponseData={setResponseData} />
    );
  } else if (selectedItem === "Fragen") {
    setActiveItem("Fragen");
    content = <Fragens />;
  } else if (selectedItem === "Charakter") {
    console.log('------------------------it must be here-----------------');
    setActiveItem("Charakter");
    content = <Charakter />;
  }

  return (
    <div className="main_content" style={{ height: "100%" }}>
      <div
        className="row  full-height"
        style={{ height: "100%", overflowX: "auto" }}
      >
        <div
          className="col-md-6  h-100"
          style={{ height: "100%", width: "100%", paddingRight: "0" }}
        >
          {!pdfData ? (
            <div
              className="upload-button"
              style={{
                position: "relative",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label htmlFor="pdfInput" className="centered-button">
                <i className="fas fa-upload"></i> {t("loadScript")}
                <img className="button-i" src={iconImage} alt="" />
              </label>
              <input
                type="file"
                id="pdfInput"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handlePDFInputChange}
              />
            </div>
          ) : (
            <TopBar
              fetchData={fetchData}
              setSelectedItem={setSelectedItem}
              selectedItem={selectedItem}
              setResponseData={setResponseData}
              setGeneration={setGeneration}
              setVideo={setVideo}
            />
          )}
          {content}
        </div>
        <div>
          <button
            style={{ margin: 20, display: "none" }}
            type="button"
            className="btn btn-primary"
            onClick={handleOpenMyModal}
          >
            Open My Modal
          </button>
          <ChapterPopUp
            title={title}
            setTitle={setTitle}
            show={showMyModal}
            onClose={handleCloseMyModal}
            onConfirm={() => setConfirmAction(true)}
            onDelete={() => setDeleteAction(true)}
            chapterTitle={handleChapterTitle}
          />
        </div>
        {pdfData && selectedItem === "Skript" && showZoomButtons ? (
          <div className="zoom-buttons">
            <div id="zoomButtons" className="zoomButtons">
              <button
                id="zoomInButton"
                style={{ background: "none" }}
                onClick={Zoom_plus}
                disabled={disableZoom}
              >
                <FontAwesomeIcon
                  icon={faSearchPlus}
                  style={{ fontSize: "33px" }}
                />{" "}
              </button>
              <button
                id="zoomOutButton"
                style={{ background: "none" }}
                disabled={disableZoom}
                onClick={Zoom_moins}
              >
                <FontAwesomeIcon
                  icon={faSearchMinus}
                  style={{ fontSize: "33px" }}
                />{" "}
              </button>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        {selectedItem === "Skript" && disableZoom && (
          <div className="pdf-spinner"></div>
        )}
      </div>

      <PopupWarning text={t("addSceneMessage")} show={showWarning} />
      
      <PopupMultipleBtn
        show={pdfError}
        text={t('GoBackToManualModeMessage')}
        btns={[{ text: t('ok'), fn: handleBackToSkript }]}
      />

      
      <PopupWarning text={t('addSceneMessage')} show={showWarning}/>
      <ModePopup 
      loading={automaticModeLoading}
      data={recievedResponse}
      onConfirm={handleConfirmMode}
      onClose={()=>{setShowPopupMode(false)}}
      setScenes={setScenes}
      setSelectedItem={setSelectedItem}
      setResponseData={setResponseData}
      setActiveItem={setActiveItem}
      show={(pdfDisplayed&&showPopupMode&&mode==null)||(pdfDisplayed&&showPopupMode&&mode.trim()==="Automatic Mode")}/>
      
    </div>
  );
};

export default PDFProcessor;
