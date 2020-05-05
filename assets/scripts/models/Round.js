var Round = (function () {
    let instance;

    function init() {
        // Private methods and variables
        let m_currentRound = 1;
        let m_currentPercentage = 10;
        //let m_roundList = [];
        return {
            // Public methods and variables
            get currentRound() { return m_currentRound; },
            set currentRound(value) { m_currentRound = value; },

            get currentPercentage() { return  m_currentPercentage;},
            set currentPercentage(value) { m_currentPercentage = value; },

            updateRound()
            {
                m_currentRound++;
                console.log("Current Round : " + m_currentRound);
                this.calculatePercentage();
            },

            calculatePercentage()
            {
                m_currentPercentage += 10;
                if(m_currentRound % 7 == 0)
                {
                    m_currentPercentage = 0;
                }
            },

            resetData()
            {
                console.log("Reset Data...");
                m_currentRound = 1;
                m_currentPercentage = 10;
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

var instance = Round.getInstance();
export default instance;