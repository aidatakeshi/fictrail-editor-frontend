export const state = () => ({
    project_id: null,
    project: {
        id: null,
        name: null,
        name_l: {},
        is_public: null,
        my_rights: null,
    },
    settings: {
        language_default: null,
        language_alt: [],
        longitude_min: null,
        longitude_max: null,
        latitude_min: null,
        latitude_max: null,
    },
    display: {
        region: [],
        map_ref_image: [],
        map_land: [],
        map_water: [],
        rail_line: [],
        station: [],
    },
});

export const getters = {
    project: (s) => s.project,
    editAllowed: (s) => {
        const my_rights = (s.project||{}).my_rights;
        return ['root', 'owner', 'editor'].includes(my_rights);
    },
    settings: (s) => s.settings,
    display: (s) => s.display,
};

export const mutations = {
    project_id(s, val) { s.project_id = val; },
    project(s, val_obj){
        for (let f in s.project){
            if (val_obj[f] !== undefined) s.project[f] = val_obj[f];
        }
    },
    settings(s, val_obj){
        for (let f in s.settings){
            if (val_obj[f] !== undefined) s.settings[f] = val_obj[f];
        }
    },
    display(s, val_obj){
        for (let f in s.display){
            if (val_obj[f] !== undefined) s.display[f] = val_obj[f];
        }
    },
};

export const actions = {
    
};