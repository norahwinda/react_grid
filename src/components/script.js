
export default function getCellCoordinates(x1, y1) {
    let x0 = 51.50676122954460000000;
    let y0 = 0.02990112592463010000;

    //  small box dimensions
    let small_box_height = 0.000005913769252;
    let small_box_width = 0.000008993350948;

    //  calculate distance from x0, y0 in degrees
    let d1 = x1 - x0;
    let d2 = y1 - y0;

    let formatted_d1 = d1.toFixed(20);
    let formatted_d2 = d2.toFixed(20);

    // converted to float for performing operations
    let float_d1 = parseFloat(formatted_d1);
    let float_d2 = parseFloat(formatted_d2);


    //  distance from 0,0 in geocoordinate canvas
    let geo_distance_1 = d1 * 111195;
    let geo_distance_2 = d2 * 111195;

    //  distance in meters
    let cartesian_distance_1 = float_d1 / small_box_height;
    let cartesian_distance_2 = float_d2 / small_box_width;


    // row and column number
    if (cartesian_distance_1 < 0 || cartesian_distance_1 > 500) {
        var row_num = "Outside the venue";
    } else {
        var row_num = Math.floor(cartesian_distance_1);
    }

    if (cartesian_distance_2 < 0 || cartesian_distance_2 > 500) {
        var col_num = "Outside the venue";
    } else {
        var col_num = Math.floor(cartesian_distance_2);
    }

    let result = {
        "start_x0_latitude": x0,
        "start_y0_longitude": y0,
        "device_latitude": x1,
        "device_longitude": y1,
        "distance_in_deg_from_x0": formatted_d1,
        "distance_in_deg_from_y0": formatted_d2,
        "geocoord_distance_from_x0_in_m": geo_distance_1,
        "geocoord_distance_from_y0_in_m": geo_distance_2,
        "distance_in_m_from_x0_cartesian_plane": cartesian_distance_1,
        "distance_in_m_from_y0_cartesian_plane": cartesian_distance_2,
        "user_id": "user id from login qr code",
        "email": "will come from the device",
        "row_number": row_num,
        "column_number": col_num
    }

    return result



}


// const x1 = 51.5082009382052;
// const y1 = 0.03318958186;

// res = get_row_column(x1, y1)

// console.log(res)