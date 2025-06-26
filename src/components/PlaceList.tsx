import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import type { Place } from '../models/Place';
import type { PlaceListProps } from '../models/PlaceListProps';
import './PlaceList.css';

function PlaceList(props: PlaceListProps) {
    let newPlaceName = "";

    function updatePlace(_place: Place, _index: number) {
        const newArr = [...props.placeList!]
        newArr[_index] = _place;
        props.setPlaceList(newArr);
    }

    function addPlace(_name: string) {
        if (_name.length > 0 && props.placeList.findIndex(_place => _place.name == _name) == -1) {
            props.setPlaceList([...props.placeList?.slice(), {
                name: _name,
                count: 1,
                editing: false
            }]);
        }
    }

    function removePlace(_index: number) {
        const newArr = props.placeList.filter((_, i) => i != _index)
        props.setPlaceList(newArr);
    }

    return (
        <div className='place-list-container'>
            <div className='new-place-container'>
                <TextField
                    id="new_place_label"
                    type="text"
                    label="Add New Spot"
                    variant="standard"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        newPlaceName = event.target.value;
                    }}
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Enter") {
                            addPlace(newPlaceName)
                        }
                    }}
                />
                <IconButton onClick={() => { addPlace(newPlaceName) }}>
                    <AddIcon color='success' />
                </IconButton>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ width: 1, height: 1 / 2 }} aria-label="List of places">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="center" size='small'>Chances</TableCell>
                            <TableCell align="center" size='small'>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.placeList.map((place, arrIndex) => {
                            return (
                                <TableRow
                                    key={place.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" className='place-list-cell--name'>
                                        <div className="cell-flex-wrapper">
                                            <span>{place.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center" size='small'>
                                        <TextField fullWidth
                                            id={`${place.name}_counter`}
                                            type="number"
                                            slotProps={{
                                                htmlInput: {
                                                    max: 10,
                                                    min: 0
                                                }
                                            }}
                                            value={place.count}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                place.count = parseInt(event.target.value, 10);
                                                updatePlace(place, arrIndex);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" size='small'>
                                        <IconButton onClick={() => removePlace(arrIndex)}><DeleteIcon color='warning' /></IconButton >
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {props.placeList.length === 0 &&
                            <TableRow>
                                <TableCell rowSpan={3}>No records found</TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default PlaceList;