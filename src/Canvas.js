import { useState, useMemo, useEffect } from 'react';
import map from "./assets/Updated_Venue_Map_Aligned_50_x_50_cm.svg"
import { ModalComponent } from './Modal'
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import { io } from "socket.io-client";
import { useStateContext } from './context/Context';
import getCellCoordinates from './components/script';
import { type } from '@testing-library/user-event/dist/type';


const Canvas = () => {
  const { workspaceData, setWorkspaceData } = useStateContext();
  const [selectedRowColumn, setSelectedRowColumn] = useState([]);
  const dummmyCoords = [

    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 51.50760394166280000000,
      "lng": 0.03095784466103210000,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 51.50759802789350000000,
      "lng": 0.03095784466103210000,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 51.50759211412430000000,
      "lng": 0.03095784466103210000,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 51.50758620035500000000,
      "lng": 0.03095784466103210000,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 51.50758028658580000000,
      "lng": 0.03096683801198020000,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 51.50753889020100000000,
      "lng": 0.03097583136292830000,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 51.50753297643180000000,
      "lng": 0.03097583136292830000,
      "link_id": "<String>"
    }]


  const superDummmyCoords = [

    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 45,
      "lng": 10,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 43,
      "lng": 12,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 42,
      "lng": 20,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 41,
      "lng": 6,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 39,
      "lng": 13,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 34,
      "lng": 6,
      "link_id": "<String>"
    },
    {
      "user_email": "ww.c@ch.com",
      "company_id": "id_1",
      "user_id": "user_id_1",
      "lat": 45,
      "lng": 10,
      "link_id": "<String>"
    }]

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io('http://216.219.86.171:3001/socket'); // Use 'http://' or 'https://' depending on your server configuration

    // Event listener for successful connection
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      console.log(workspaceData)
      socket.emit('clientMessage', 'Hello Server!'); // Send a message to the server
    });

    // Event listener for receiving messages from the server
    socket.on('serverMessage', (message) => {
      console.log('Received message from server:', message);
      // Update your component state or perform other actions with the received data

      // setWorkspaceData(message);

    });

    socket.on('clientMessageTester', (message) => {
      console.log("Received message from Test client server: ", message);
      setWorkspaceData(message);

    })


    // Event listener for Socket.IO errors
    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
      // Handle error state or reconnect logic here
    });
  })


  const canvasSize = 52; // in centimeters
  const boxSize = 1; // in centimeters
  const numBoxes = (50 / boxSize) + 1; // Number of boxes per side

  const [cellsSelected, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);

  const [selections, setSelections] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null)

  const [showModal, setShowModal] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [selectionColors, setSelectionColors] = useState([]);

  const [isLoading, setIsLoading] = useState(false)

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

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  // const handleMouseEnter = (cellIndex) => {
  //   if (isDragging && currentSelection !== null) {
  //     setEndCell(cellIndex);
  //     setSelections(prevSelections => {
  //       const newSelections = [...prevSelections];
  //       const currentSel = new Set(newSelections[currentSelection]);
  //       const startCoords = getCellCoords(startCell);
  //       const endCoords = getCellCoords(cellIndex);
  //       const minX = Math.min(startCoords.x, endCoords.x);
  //       const maxX = Math.max(startCoords.x, endCoords.x);
  //       // Adjust for the inverted y-axis due to the origin being at the bottom left
  //       const minY = Math.min(startCoords.y, endCoords.y);
  //       const maxY = Math.max(startCoords.y, endCoords.y);
  //       for (let x = minX; x <= maxX; x++) {
  //         for (let y = minY; y <= maxY; y++) {
  //           // Adjust the index calculation for the inverted Y-axis
  //           currentSel.add((numBoxes - y - 1) * numBoxes + x);
  //         }
  //       }
  //       newSelections[currentSelection] = currentSel;
  //       return newSelections;
  //     });
  //   }
  // };

  const handleMouseEnter = (cellIndex) => {
    if (isDragging && currentSelection !== null) {
      setEndCell(cellIndex);
      setSelections(prevSelections => {
        const newSelections = [...prevSelections];
        const newSelection = new Set();
        const startCoords = getCellCoords(startCell);
        const endCoords = getCellCoords(cellIndex);
        const minX = Math.min(startCoords.x, endCoords.x);
        const maxX = Math.max(startCoords.x, endCoords.x);
        const minY = Math.min(startCoords.y, endCoords.y);
        const maxY = Math.max(startCoords.y, endCoords.y);
        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            const index = (numBoxes - y - 1) * numBoxes + x;
            newSelection.add(index);
          }
        }
        newSelections[currentSelection] = newSelection;
        return newSelections;
      });
    }
  };

  const handleCellClick = (event, cellIndex) => {
    event.preventDefault();
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


  const fetchSelections = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('https://100085.pythonanywhere.com/api/v1/bett_event/65ab86f2c5b56cc2cab8a973/');
      const apiData = response.data.response[0];
      const newSelections = [];
      const newSelectionColors = [];

      // Iterate over each column in the data
      for (let x = 0; x < numBoxes; x++) {
        const columnData = apiData[`c${x}`];
        if (columnData) {
          // Group cells by color
          const colorGroups = columnData.reduce((acc, cellData) => {
            const color = cellData.color_code;
            if (!acc[color]) {
              acc[color] = new Set();
            }
            const y = parseInt(cellData.row_number.slice(1)); // Convert row_number to y coordinate
            const cellIndex = (numBoxes - y - 1) * numBoxes + x;
            acc[color].add(cellIndex);
            return acc;
          }, {});

          // Add each group of cells to the selections
          for (const [color, indices] of Object.entries(colorGroups)) {
            newSelections.push(indices);
            newSelectionColors.push(color);
          }
        }
      }

      setSelections(newSelections);
      setSelectionColors(newSelectionColors);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSelections()
  }, []);


  const canvasStyle = useMemo(() => ({
    position: 'relative',
    width: `${canvasSize}cm`, // Set the width of the canvas
    height: `${canvasSize}cm`, // Set the height of the canvas
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }), [canvasSize]);



  function AppendItems(arr, newStr) {
    return arr.push(newStr)
  }
  //  MAIN
  // useEffect(() => {
  //   if (selectedRowColumn.length < 8) {
  //     dummmyCoords.forEach((item) => {
  //       let data = getCellCoordinates(item.lat, item.lng)
  //       let row = data.row_number
  //       let col = data.column_number
  //       let coords = `row_${col}col_${row}`
  //       const updatedArray = AppendItems(selectedRowColumn, coords)

  //       console.log("coords", coords)

  //       setSelectedRowColumn(updatedArray)
  //       // setSelectedRowColumn({...getCellCoordinates(item.lat, item.lng)})
  //       // console.log(selectedRowColumn)
  //       console.log("selectedRow...", selectedRowColumn);


  //     })
  //   }

  // }, [selectedRowColumn])



  useEffect(() => {
    if (selectedRowColumn.length < 8) {
      superDummmyCoords.forEach((item) => {
        // let data = getCellCoordinates(item.lat, item.lng)
        const row = item.lat
        const col = item.lng
        const coords = `row_${row}col_${col}`
        const updatedArray = AppendItems(selectedRowColumn, coords)

        console.log("coords", coords)

        setSelectedRowColumn(updatedArray)
        // setSelectedRowColumn({...getCellCoordinates(item.lat, item.lng)})
        console.log(selectedRowColumn)
      })
    }

  }, [selectedRowColumn])



  return (

    <>

      <div style={{
        margin: '3px',
        display: 'flex',
        flexDirection: 'row',
        gap: 10, zIndex: 10,
        left: '0.95cm',
        position: 'fixed',
      }}>

        <Button
          size='sm'
          variant='warning'
          onClick={() => setSelections([])}
        >
          Clear All Selections
        </Button>
        <Button
          size='sm'
          variant='success'
          onClick={fetchSelections}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div style={canvasStyle}>

        {/* <div style={{ 
                position: 'absolute', 
                left: `${boxSize / 2}cm`, 
                top: `${boxSize / 2}cm`, 
                width: `calc(${canvasSize}cm - ${boxSize}cm)`, 
                height: `calc(${canvasSize}cm - ${boxSize}cm)`,
                zIndex: -1 // To place it beneath the grid
                }}>
                
            </div> */}

        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numBoxes}, ${boxSize}cm)`,
            gridTemplateRows: `repeat(${numBoxes}, ${boxSize}cm)`,
            width: `calc(${canvasSize}cm - 1.9cm)`,
            height: `calc(${canvasSize}cm - 1.9cm)`, //
            // border: '1px solid black',
            userSelect: 'none', // Prevent text selection
            // margin: '1cm', // Add 1cm space around the grid
            position: 'absolute', // Position the grid absolutely within the canvas
            top: '50%', // Center the grid vertically
            left: '50%', // Center the grid horizontally
            transform: 'translate(-50%, -50%)' // Ensure the grid is centered correctly
          }}
          onMouseLeave={() => isDragging && setIsDragging(false)}
        >
          {gridCells.map((cellIndex) => {
            const selectionIndex = selections.findIndex(selection => selection.has(cellIndex));
            const isSelected = selectionIndex !== -1;
            // const color = isSelected ? selectionColors[selectionIndex] : 'transparent';
            const { x, y } = getCellCoords(cellIndex); // Get the coordinates for the tooltip
            let tempID = `row_${y}col_${x}`;
            // console.log("tempID", tempID)
            console.log(tempID, [...selectedRowColumn])
            // { Array.from(selectedRowColumn).includes(tempID) ? console.log("COLOR PRESENT", tempID) : console.log("NO COLOR PRESENT", tempID) }
            const color = Array.from(selectedRowColumn).includes(tempID) ? "green" : 'transparent';

            return (
              <div
                key={cellIndex}
                id={`row_${y}col_${x}`}
                className={`box ${isSelected ? 'selected' : ''}`}
                style={{
                  border: '0.1px solid #ddd',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  backgroundColor: color
                }}
                title={`Row: ${y}, Col: ${x}`} // Set the title attribute for the tooltip
                onMouseDown={() => handleMouseDown(cellIndex)}
                onMouseEnter={() => handleMouseEnter(cellIndex)}
                onMouseUp={handleMouseUp}
                // onClick={() => handleCellClick(cellIndex)}
                onContextMenu={(event) => handleCellClick(event, cellIndex)}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `calc(${canvasSize}cm - 1.9cm - ${boxSize}cm)`,
              height: `calc(${canvasSize}cm - 1.9cm - ${boxSize}cm)`,
              // boxSizing: 'border-box', // Include padding and border in the element's width and height
              transform: 'translate(-50%, -50%)', // Center the div
              zIndex: -1,
              border: '0.1px solid #f00000'
            }}
          >
            <img
              src={map}
              alt="Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // zIndex: -1,
              }}
            />
          </div>
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


