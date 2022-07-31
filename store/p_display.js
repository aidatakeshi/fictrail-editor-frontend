export const state = () => ({
    project_id: null,
    screen_width: null,
    screen_height: null,
    x: null,
    y: null,
    logzoom: null,
    cursor_x: null,
    cursor_y: null,
    longitude_min: null,
    longitude_max: null,
    latitude_min: null,
    latitude_max: null,
    edit_mode: "ref_images",
    selected: {
        type: null,
        id: null,
        part: null,
        index: null,
        position: null,
    },
    info_panel_open: false,
    info_panel_semi: true,
    display: {
        show_map_ref_images: true,
        show_lat_long_lines: true,
        show_region_borders: true,
        show_region_sub_borders: true,
        show_stations: true,
        show_stations_minor: true,
        show_stations_not_in_use: true,
        show_stations_signal_only: true,
        rail_line_color: "rail_line_type",
        unlocked: {
            map_ref_image: [],
            map_land: [],
            map_water: [],
            region: [],
            region_sub: [],
        },
        hidden: {
            map_ref_image: [],
            line_type: [],
            operator_type: [],
        },
    },
});

export const getters = {
    screen_width: (s) => s.screen_width,
    screen_height: (s) => s.screen_height,
    x: (s) => s.x,
    y: (s) => s.y,
    logzoom: (s) => s.logzoom,
    cursor_x: (s) => s.cursor_x,
    cursor_y: (s) => s.cursor_y,
    px_per_lat_deg: (s) => getPixelsPerLatitudeDegree(s),
    px_per_long_deg: (s) => getPixelsPerLongitudeDegree(s),
    x_min: (s) => (s.x - s.screen_width / 2 / getPixelsPerLongitudeDegree(s)),
    x_max: (s) => (s.x + s.screen_width / 2 / getPixelsPerLongitudeDegree(s)),
    y_min: (s) => (s.y - s.screen_height / 2 / getPixelsPerLatitudeDegree(s)),
    y_max: (s) => (s.y + s.screen_height / 2 / getPixelsPerLatitudeDegree(s)),
    //
    edit_mode: (s) => s.edit_mode,
    selected_type: (s) => s.selected.type,
    selected_id: (s) => s.selected.id,
    selected_part: (s) => s.selected.part,
    selected_index: (s) => s.selected.index,
    selected_position: (s) => s.selected.position,
    info_panel_status: (s) => {
        if (!s.info_panel_open) return 'close';
        if (!s.info_panel_semi) return 'open';
        return 'semi-open';
    },
    //
    isShowMapRefImages: (s) => s.display.show_map_ref_images,
    isShowLatLongLines: (s) => s.display.show_lat_long_lines,
    isShowRegionBorders: (s) => s.display.show_region_borders,
    isShowRegionSubBorders: (s) => s.display.show_region_sub_borders,
    isShowStations: (s) => s.display.show_stations,
    isShowStationsMinor: (s) => s.display.show_stations_minor,
    isShowStationsNotInUse: (s) => s.display.show_stations_not_in_use,
    isShowStationsSignalOnly: (s) => s.display.show_stations_signal_only,
    isRailLineColorByLineType: (s) => s.display.rail_line_color === "rail_line_type",
    isRailLineColorByOperatorType: (s) => s.display.rail_line_color === "rail_operator_type",
    //
    isMapRefImageLocked: (s) => (id) => !s.display.unlocked.map_ref_image.includes(id),
    isMapLandLocked: (s) => (id) => !s.display.unlocked.map_land.includes(id),
    isMapWaterLocked: (s) => (id) => !s.display.unlocked.map_water.includes(id),
    isRegionLocked: (s) => (id) => !s.display.unlocked.region.includes(id),
    isRegionSubLocked: (s) => (id) => !s.display.unlocked.region_sub.includes(id),
    isMapRefImageHidden: (s) => (id) => s.display.hidden.map_ref_image.includes(id),
    isLineTypeHidden: (s) => (id) => s.display.hidden.line_type.includes(id),
    isOperatorTypeHidden: (s) => (id) => s.display.hidden.operator_type.includes(id),
};

export const mutations = {
    project_id(s, val) { s.project_id = val; },
    screen_width(s, val) { s.screen_width = val; constraintXYZoom(s); },
    screen_height(s, val) { s.screen_height = val; constraintXYZoom(s); },
    screen_size(s, {width, height}){
        s.screen_width = width;
        s.screen_height = height;
        constraintXYZoom(s);
    },
    x(s, val) { s.x = val; constraintXYZoom(s); },
    y(s, val) { s.y = val; constraintXYZoom(s); },
    logzoom(s, val) { s.logzoom = val; constraintXYZoom(s); },
    x_step(s, step){ s.x += step; constraintXYZoom(s); },
    y_step(s, step){ s.y += step; constraintXYZoom(s); },
    logzoom_step(s, step){ s.logzoom += step; constraintXYZoom(s); },
    cursor_x(s, val) { s.cursor_x = val; },
    cursor_y(s, val) { s.cursor_y = val; },
    x_min(s, val){ s.x = val + s.screen_width / getPixelsPerLongitudeDegree(s) / 2; },
    x_max(s, val){ s.x = val - s.screen_width / getPixelsPerLongitudeDegree(s) / 2; },
    y_min(s, val){ s.y = val + s.screen_height / getPixelsPerLatitudeDegree(s) / 2; },
    y_max(s, val){ s.y = val - s.screen_height / getPixelsPerLatitudeDegree(s) / 2; },
    settings(s, val_obj){
        for (let f of ['longitude_min', 'longitude_max', 'latitude_min', 'latitude_max']){
            if (val_obj[f] !== undefined) s[f] = val_obj[f];
        }
    },
    //
    edit_mode(s, val){ s.edit_mode = val; },
    selected(s, val_obj){
        for (let f in s.selected){
            if (val_obj[f] !== undefined) s.selected[f] = val_obj[f];
        }
    },
    info_panel_open(s, val){ s.info_panel_open = val; },
    info_panel_semi(s, val){ s.info_panel_semi = val; },
    //
    display(s, val_obj){
        for (let f in s.display){
            if (val_obj[f] !== undefined) s.display[f] = val_obj[f];
        }
    },
    show_map_ref_images(s, val_bool){
        s.display.show_map_ref_images = val_bool;
    },
    show_lat_long_lines(s, val_bool){
        s.display.show_lat_long_lines = val_bool;
    },
    show_region_borders(s, val_bool){
        s.display.show_region_borders = val_bool;
    },
    show_region_sub_borders(s, val_bool){
        s.display.show_region_sub_borders = val_bool;
    },
    show_stations(s, val_bool){
        s.display.show_stations = val_bool;
    },
    show_stations_minor(s, val_bool){
        s.display.show_stations_minor = val_bool;
    },
    show_stations_not_in_use(s, val_bool){
        s.display.show_stations_not_in_use = val_bool;
    },
    show_stations_signal_only(s, val_bool){
        s.display.show_stations_signal_only = val_bool;
    },
    rail_line_color(s, value){
        s.display.rail_line_color = value;
    },
    //
    unlocked(s, val_obj){
        for (let f in s.display.unlocked){
            if (val_obj[f] !== undefined) s.display.unlocked[f] = val_obj[f];
        }
    },
    hidden(s, val_obj){
        for (let f in s.display.hidden){
            if (val_obj[f] !== undefined) s.display.hidden[f] = val_obj[f];
        }
    },
    //
    unlockMapRefImage(s, id){ s.unlocked.map_ref_image.push(id); },
    lockMapRefImage(s, id){
        s.unlocked.map_ref_image = s.unlocked.map_ref_image.filter((item) => item.id !== id);
    },
    unlockMapLand(s, id){ s.unlocked.map_land.push(id); },
    lockMapLand(s, id){
        s.unlocked.map_land = s.unlocked.map_land.filter((item) => item.id !== id);
    },
    unlockMapWater(s, id){ s.unlocked.map_water.push(id); },
    lockMapWater(s, id){
        s.unlocked.map_water = s.unlocked.map_water.filter((item) => item.id !== id);
    },
    unlockRegion(s, id){ s.unlocked.region.push(id); },
    lockRegion(s, id){
        s.unlocked.region = s.unlocked.region.filter((item) => item.id !== id);
    },
    unlockRegionSub(s, id){ s.unlocked.region_sub.push(id); },
    lockRegionSub(s, id){
        s.unlocked.region_sub = s.unlocked.region_sub.filter((item) => item.id !== id);
    },
    showMapRefImage(s, id){ s.unlocked.map_ref_image.push(id); },
    hideMapRefImage(s, id){
        s.unlocked.map_ref_image = s.unlocked.map_ref_image.filter((item) => item.id !== id);
    },
    showLineType(s, id){ s.unlocked.line_type.push(id); },
    hideLineType(s, id){
        s.unlocked.line_type = s.unlocked.line_type.filter((item) => item.id !== id);
    },
    showOperatorType(s, id){ s.unlocked.operator_type.push(id); },
    hideOperatorType(s, id){
        s.unlocked.operator_type = s.unlocked.operator_type.filter((item) => item.id !== id);
    },
};

export const actions = {
    init({commit}, project_id){
        //Set project_id
        commit('project_id', project_id);
        //Load from local storage
        if (process.client){
            //x, y, logzoom (number)
            for (let attr of ['x', 'y', 'logzoom']){
                const value = parseFloat(localStorage.getItem(`${project_id}/${attr}`));
                if (!isNaN(value)){
                    commit(attr, value);
                }
            }
            //edit_mode (string)
            const edit_mode = localStorage.getItem(`${project_id}/edit_mode`);
            if (edit_mode){
                commit('edit_mode', edit_mode);
            }
            //display (object)
            const display_str = localStorage.getItem(`${project_id}/display`);
            if (display_str){
                commit('display', JSON.parse(display_str));
            }
        }
    },
    save_xyzoom({state: s}){
        if (process.client){
            localStorage.setItem(`${s.project_id}/x`, s.x);
            localStorage.setItem(`${s.project_id}/y`, s.y);
            localStorage.setItem(`${s.project_id}/logzoom`, s.logzoom);
        }
    },
    save_edit_mode({state: s}){
        if (process.client){
            localStorage.setItem(`${s.project_id}/edit_mode`, s.edit_mode);
        }
    },
    save_display({state: s}){
        if (process.client){
            const val = JSON.stringify(s.display);
            localStorage.setItem(`${s.project_id}/display`, val);
        }
    },
};

/**
 * Shared Functions
 */
const getPixelsPerLatitudeDegree = (s) => {
    return 10 ** s.logzoom;
};
const getPixelsPerLongitudeDegree = (s) => {
    const y_radian = s.y * Math.PI / 180;
    return (10 ** s.logzoom) * Math.cos(y_radian);
};
const constraintXYZoom = (s) => {
    //Only do when certain settings are not null
    for (let f of ['screen_width', 'screen_height', 'longitude_max', 'longitude_min', 'latitude_max', 'latitude_min']){
        if (s[f] === null) return false;
    }
    //Constraint logzoom
    const zoom_min_x = Math.min(s.screen_width / (s.longitude_max - s.longitude_min));
    const zoom_min_y = Math.min(s.screen_height / (s.latitude_max - s.latitude_min));
    const logzoom_min = Math.log10(Math.min(zoom_min_x, zoom_min_y));
    if (s.logzoom < logzoom_min){
        s.logzoom = logzoom_min;
    }
    //Constraint x
    const pixels_per_long_deg = getPixelsPerLongitudeDegree(s);
    const x_lower_limit = s.longitude_min + s.screen_width / 2 / pixels_per_long_deg;
    if (s.x < x_lower_limit) s.x = x_lower_limit;
    const x_upper_limit = s.longitude_max - s.screen_width / 2 / pixels_per_long_deg;
    if (s.x > x_upper_limit) s.x = x_upper_limit;
    //Constraint y
    const pixels_per_lat_deg = getPixelsPerLatitudeDegree(s);
    const y_lower_limit = s.latitude_min + s.screen_height / 2 / pixels_per_lat_deg;
    if (s.y < y_lower_limit) s.y = y_lower_limit;
    const y_upper_limit = s.latitude_max - s.screen_height / 2 / pixels_per_lat_deg;
    if (s.y > y_upper_limit) s.y = y_upper_limit;
}