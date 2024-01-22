import { useState, useMemo, useEffect } from 'react';
import map from "./assets/image.svg"
import { ModalComponent } from './Modal'
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import SideBar from './components/sidebar/sidebar';

const Canvas = () => {
  const canvasSize = 52; // in centimeters
  const boxSize = 1; // in centimeters
  const numBoxes = canvasSize / boxSize; // Number of boxes per side

  const [cellsSelected, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);

  const [selections, setSelections] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null)

  const [showModal, setShowModal] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [selectionColors, setSelectionColors] = useState([]);

  const getCellCoords = (index) => ({
    x: index % numBoxes,
    y: numBoxes - Math.floor(index / numBoxes) - 1,
  });

  const selectedCellCoordinates = cellsSelected.map(getCellCoords);

  const handleMouseDown = (cellIndex) => {
    setIsDragging(true);
    setStartCell(cellIndex);
    setEndCell(cellIndex);
    // Start a new selection
    console.log("endCell", endCell)
    setCurrentSelection(selections.length);
    setSelections(prevSelections => [...prevSelections, new Set([cellIndex])]);
  };


  const handleMouseEnter = (cellIndex) => {
    if (isDragging && currentSelection !== null) {
      setEndCell(cellIndex);
      setSelections(prevSelections => {
        const newSelections = [...prevSelections];
        const currentSel = new Set(newSelections[currentSelection]);
        const startCoords = getCellCoords(startCell);
        const endCoords = getCellCoords(cellIndex);
        const minX = Math.min(startCoords.x, endCoords.x);
        const maxX = Math.max(startCoords.x, endCoords.x);
        // Adjust for the inverted y-axis due to the origin being at the bottom left
        const minY = Math.min(startCoords.y, endCoords.y);
        const maxY = Math.max(startCoords.y, endCoords.y);
        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            // Adjust the index calculation for the inverted Y-axis
            currentSel.add((numBoxes - y - 1) * numBoxes + x);
          }
        }
        newSelections[currentSelection] = currentSel;
        return newSelections;
      });
    }
  };

  const handleCellClick = (cellIndex) => {
    // Find the selection that contains the clicked cell
    const selectionIndex = selections.findIndex(selection => selection.has(cellIndex));
    if (selectionIndex !== -1) {
      // Set the current selection
      setCurrentSelection(selectionIndex);
      // Get the selected cells from the selection
      const selectedCells = Array.from(selections[selectionIndex]);
      console.log('Selected cells:', selectedCells);
      // Calculate and log the coordinates of the selection
      const coords = selectedCells.map(getCellCoords);
      const xCoords = coords.map(coord => coord.x);
      const yCoords = coords.map(coord => coord.y);
      const minX = Math.min(...xCoords);
      const maxX = Math.max(...xCoords);
      const minY = Math.min(...yCoords);
      const maxY = Math.max(...yCoords);
      const topLeftCoords = { x: minX, y: minY };
      const topRightCoords = { x: maxX, y: minY };
      const bottomLeftCoords = { x: minX, y: maxY };
      const bottomRightCoords = { x: maxX, y: maxY };
      const topLeft = [topLeftCoords.x, topLeftCoords.y]
      const topRight = [topRightCoords.x, topRightCoords.y]
      const bottomLeft = [bottomLeftCoords.x, bottomLeftCoords.y]
      const bottomRight = [bottomRightCoords.x, bottomRightCoords.y];

      console.log("Selections", selections)
      console.log(`Selection coordinates: 
        topLeft: ${topLeft},
        topRight: ${topRight}
        bottomLeft: ${bottomLeft},
        bottomRight: ${bottomRight}`
      )
      setCoordinates([topLeft, topRight, bottomLeft, bottomRight])
      setSelectedCells(selectedCells)
      setShowModal(true)
    }
  }


  const handleMouseUp = () => {
    setIsDragging(false);
    // const selectedArray = Array.from(selections[currentSelection] || []).sort((a, b) => a - b);    console.log('Selected cells:', selectedArray);
    // // Log the coordinates of the selection
    // if (selectedArray.length > 0) {
    //   const topLeftCoords = getCellCoords(selectedArray[0]);
    //   const bottomRightCoords = getCellCoords(selectedArray[selectedArray.length - 1]);
    //   const topRightCoords = { x: bottomRightCoords.x, y: topLeftCoords.y };
    //   const bottomLeftCoords = { x: topLeftCoords.x, y: bottomRightCoords.y };
    //   console.log(` [[topLeft], [topRight], [bottomLeft], [bottomRight ] 
    // [[${topLeftCoords.x}, ${topLeftCoords.y}], [${topRightCoords.x}, ${topRightCoords.y}], [${bottomLeftCoords.x}, ${bottomLeftCoords.y}], [${bottomRightCoords.x}, ${bottomRightCoords.y}]]`);
    // }
  };

  const clearSelectionByCells = (selectedCellsToRemove) => {
    setSelections(prevSelections => {
      // Convert the array of cells to remove into a Set for efficient lookup
      const cellsToRemoveSet = new Set(selectedCellsToRemove);

      // Filter out the selection that matches the cells to remove
      const newSelections = prevSelections.filter(selection => {
        // Check if the selection has any of the cells to remove
        const hasCellToRemove = Array.from(selection).some(cell => cellsToRemoveSet.has(cell));
        return !hasCellToRemove;
      });

      return newSelections;
    });
  };

  const gridCells = Array.from({ length: numBoxes * numBoxes }, (_, index) => index);
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhbbbbbbb", gridCells)

  const canvasStyle = useMemo(() => ({
    position: 'relative',
    width: `${canvasSize}cm`, // Set the width of the canvas
    height: `${canvasSize}cm`, // Set the height of the canvas
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }), [canvasSize]);


  const fetchSelections = async () => {
    try {
      const response = await axios.get();
      const apiData = response.data.response[0];
      const newSelections = [];
      const newSelectionColors = [];
      for (let x = 1; x <= numBoxes; x++) {
        const columnData = apiData[`c${x}`];
        if (columnData) {
          for (const cellData of columnData) {
            const y = parseInt(cellData.row_number.slice(1)); // remove the 'r' prefix and convert to number

            // Adjust the index calculation for the inverted Y-axis
            const cellIndex = (numBoxes - y - 1) * numBoxes + x; // convert x, y coordinates to cell index
            console.log("cellIndex", cellIndex);
            newSelections.push(new Set([cellIndex]));
            newSelectionColors.push(cellData.color_code); // add color code to the selection colors
          }
        }
      }
      console.log("NewSelections", newSelections);
      setSelections(newSelections);
      setSelectionColors(newSelectionColors); // set the new selection colors
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSelections()
  }, []);




  return (

    <>

      <div style={{
        margin: '3px',
        display: 'flex',
        flexDirection: 'row',
        gap: 10, zIndex: 10,
        position: 'fixed',
      }}>

        <Button
          variant='warning'
          onClick={() => setSelections([])} // Clears all selections// Adjust the position as needed
        >
          Clear All Selections
        </Button>
        <Button
          variant='success'
          onClick={fetchSelections} // Clears all selections// Adjust the position as needed
        >
          Refresh
        </Button>
      </div>


      <div style={canvasStyle}>
        <div style={{
          position: 'absolute',
          // left: `${boxSize * 10}cm`,
          // top: `${boxSize * 10}cm`,
          width: `${canvasSize - boxSize}cm`,
          height: `${canvasSize - boxSize}cm`,
          //zIndex: -1 // To place it beneath the grid
        }}>
          <img
            src={map}
            alt="Background"
            style={{
              width: `${canvasSize - boxSize}cm`,
              height: `${canvasSize - boxSize}cm`,
            }}
          />
        </div>

        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numBoxes}, ${boxSize}cm)`,
            gridTemplateRows: `repeat(${numBoxes}, ${boxSize}cm)`,
            width: `${canvasSize}cm`,
            height: `${canvasSize}cm`,
            border: '0.1px solid black',
            userSelect: 'none', // Prevent text selection
            zIndex: '9'
          }}
          onMouseLeave={() => isDragging && setIsDragging(false)}
        >
          {gridCells.map((cellIndex) => {
            const selectionIndex = selections.findIndex(selection => selection.has(cellIndex));
            const isSelected = selectionIndex !== -1;
            const color = isSelected ? selectionColors[selectionIndex] : 'transparent';
            return (
              <div
                key={cellIndex}
                className={`box ${isSelected ? 'selected' : ''}`}
                style={{
                  border: '0.1px solid lightgrey',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  backgroundColor: color
                }}
                onMouseDown={() => handleMouseDown(cellIndex)}
                onMouseEnter={() => handleMouseEnter(cellIndex)}
                onMouseUp={handleMouseUp}
                onClick={() => handleCellClick(cellIndex)}
              />
            );
          })}
        </div>
      </div>

      <ModalComponent
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        coordinates={coordinates}
        cellCoords={selectedCellCoordinates}
        selectedCells={cellsSelected}
        clearSelectionByCells={clearSelectionByCells}
        selectionColors={selectionColors}
        setSelectionColors={setSelectionColors}
        currentSelection={currentSelection}
      />
    </>
  );
};

export default Canvas;