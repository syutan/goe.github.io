var Building = (function () {
    let instance;

    function init() {
        // Private methods and variables
        let current_building;
        let buildingList = [
            {
                id: 0,
                name: "building1",
                money: 35,
                carbon: 10
            },
            {
                id: 1,
                name: "building2",
                money: 65,
                carbon: 120
            }
        ];

        return {
            // Public methods and variables
            get current () {
                return current_building;
            },
            set current (id) {
                current_building = buildingList[id];
            },

            get name () {
                return current_building.name;
            },

            get money () {
                return current_building.money;
            },

            get carbon () {
                return current_building.carbon;
            }
        };
    }; //init end

    return {
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }

            return instance;
        }
    };

})();

var instance = Building.getInstance();
export default instance;