/* eslint-disable react/prop-types */
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.css';
import { useState } from 'react';


export const ModalComponent = ({
  showModal, handleClose, selectedCells,
  clearSelectionByCells, selectionColors,
  currentSelection, setSelectionColors,
  coordinates, cellCoords }) => {

  const handleClearSelection = () => {
    clearSelectionByCells(selectedCells);
    handleClose(); // Close the modal after clearing the selection
  };

  const [standNumber, setStandNumber] = useState('')
  const [selectionOption, setSelectionOption] = useState('stand');
  const [loading, setLoading] = useState(false)

  // const [ boxId, setBoxId ] = useState('')


  const handleOptionChange = (e) => {
    setSelectionOption(e.target.value);
    const colorMap = {
      stand: '#008000', // green
      passage: '#FFFF00', // yellow
      inactive: '#FF0000', // red
    };
    const newColors = [...selectionColors];
    newColors[currentSelection] = colorMap[e.target.value];
    setSelectionColors(newColors);
  };


  const handleSubmit = async () => {
    console.log("selectionPoints", coordinates)
    setLoading(true)

    for (const { x, y } of cellCoords) {
      const data = {
        color_code: selectionColors[currentSelection],
        colm_number: `c${x}`,
        row_number: `r${y}`,
        stand_number: standNumber,
        type_of_place: selectionOption,
        box_id: `c${x}r${y}`
      };

      console.log(data);

      const response = await fetch('', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Failed to submit data for coordinates', x, y, response);
        // Optionally break the loop if you want to stop sending requests after the first failure
        break;
      }
    }
    setLoading(false)
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Selection Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* <Form.Group className="mb-3" controlId="formStandNumber">
            <Form.Label>Box Id</Form.Label>
            <Form.Control 
              type="text" 
              value={boxId}
              onChange={(e) => setBoxId(e.target.value)} 
            />
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="formStandNumber">
            <Form.Label>Stand Number</Form.Label>
            <Form.Control type="text" placeholder="Enter stand number" value={standNumber} onChange={(e) => setStandNumber(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSelectionOption">
            <Form.Label>Selection Option</Form.Label>
            <Form.Control as="select" value={selectionOption} onChange={handleOptionChange}>
              <option value="stand">Stand</option>
              <option value="passage">Passage</option>
              <option value="inactive">Inactive</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-2" controlId="formCoordinates">
            <Form.Label>Selection Coordinates</Form.Label>
            <Form.Control as="textarea" readOnly value={JSON.stringify(cellCoords)} />
          </Form.Group>

          {/* <Form.Group controlId="formCoordinates">
            <Form.Label>Selected Cells</Form.Label>
            <Form.Control as="textarea" readOnly value={JSON.stringify(selectedCells)} />
          </Form.Group> */}

          <div style={{ display: 'flex', marginTop: "5px", gap: "10px", alignItems: 'center' }}>
            <input
              type="color"
              readOnly
              value={selectionColors[currentSelection] ? selectionColors[currentSelection] : "#0e1df6"}
            // onChange={(e) => {
            //   const newColors = [...selectionColors];
            //   newColors[currentSelection] = e.target.value;
            //   setSelectionColors(newColors);
            // }}
            />
          </div>
        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClearSelection}>
          Clear
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {loading ? 'submitting..' : 'submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};