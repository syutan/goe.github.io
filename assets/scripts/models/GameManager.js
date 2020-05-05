var GameManager = (function () {
    let instance;

    function init() {
        cc.log("GameManager.init()");
        // Private methods and variables
        const maxEnvironment = 5000;
        const maxFinancial = 5000;
        const maxSociety = 5000;

        const minEnvironment = 10;
        const minFinancial = 10;
        const minSociety = 10;

        const initEnvironment = 3000;
        const initFinancial = 3000;
        const initSociety = 3000;

        let m_financial = initFinancial;
        let m_environment = initEnvironment;
        let m_society = initSociety;

        let yearCounter = 0;
        let monthCounter = 0;
        let months = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
        let m_gameOver = false;

        return {
            // Public methods and variables
            get maxEnvironment() { return maxEnvironment; },
            get maxFinancial() { return maxFinancial; },
            get maxSociety() { return maxSociety; },

            get environment() { return m_environment; },
            get financial() { return m_financial; },
            get society() { return m_society; },

            get month() { return months[monthCounter]; },

            get mthCounter() { return monthCounter; },
            set mthCounter(value) { monthCounter = value; },

            get yrCounter() { return yearCounter; },
            set yrCounter(value) { yearCounter = value; },

            get gameOver() { return m_gameOver; },
            set gameOver(value) { m_gameOver = value; },

            resetData() {
                m_environment = initEnvironment;
                m_financial = initFinancial;
                m_society = initSociety;

                yearCounter = 0;
                monthCounter = 0;
                m_gameOver = false;
            },

            //Update Society, Financial, Enviornment by question index
            updateEFS(question, isYes) {
                cc.log(question);
                var environment, society, financial;
                if(isYes)
                {
                    environment = this.calculateEnvironmentValue(question.Enviroment1);
                    financial = this.calculateFinancialValue(question.Financial1);
                    society = this.calculateSocietyValue(question.Society1);
                }
                else {
                    environment = this.calculateEnvironmentValue(question.Enviroment2);
                    financial = this.calculateFinancialValue(question.Financial2);
                    society = this.calculateSocietyValue(question.Society2);
                }
                console.log(m_environment + ", " + m_financial + ", " + m_society);
                console.log(environment + ", " + financial + ", " + society);
                m_environment += environment;
                m_financial += financial;
                m_society += society;
                console.log(m_environment + ", " + m_financial + ", " + m_society);
                this.checkGameOver();
            },

            buildWithMoney() {
                m_financial -= 300;
                this.checkGameOver();
            },

            checkGameOver() {
                if(m_environment <= minEnvironment || m_society <= minSociety || m_financial <= minFinancial) {
                    m_gameOver = true;
                }
            },

            checkEFSLimits() {
                if(m_environment <= maxEnvironment) m_environment = maxEnvironment;
                if(m_financial <= maxFinancial) m_financial = maxFinancial;
                if(m_society <= maxSociety) m_society = maxSociety;
            },

            calculateSocietyValue(value)
            {
                cc.log("calculateSocietyValue(", value, ")");
                //if(typeof value != "string")
                return parseInt(value);

                //var _tempValue = value.replace("%", "");
                //cc.log(_tempValue);
                //var calculatedSociety = _tempValue * 0.01 * m_society;

                //return calculatedSociety;
            },

            calculateFinancialValue(value)
            {
                cc.log("calculateFinancialValue(", value, ")");
                //if(typeof value != "string") 
                return parseInt(value);

                //var _tempValue = value.replace("%", "");
                //var calculatedFinancial = _tempValue * 0.01 * m_financial;

                //return calculatedFinancial;
            },

            calculateEnvironmentValue(value)
            {
                cc.log("calculateEnvironmentValue(", value, ")");
                //if(typeof value != "string")
                return parseInt(value);

                //var _tempValue = value.replace("%", "");
                //var calculatedEnvironment = _tempValue * 0.01 * m_environment;

                //return calculatedEnvironment;
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

var instance = GameManager.getInstance();
export default instance;