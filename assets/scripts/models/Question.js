var Question = (function () {
    let instance;

    function init() {
        cc.log("Question.init()");
        // Private methods and variables
        let currentIndex;
        let questions = null;
        console.log(questions);
        var self = this;
        cc.loader.loadRes( "json/RandomQuestion.json", function( err, res)
        {
            if (err) {
                console.log(err);
                return;
            }

            questions = res.json;
            console.log(questions);
        });
        
        return {
            // Public methods and variables

            get currentIndex() { return currentIndex; },
            //set currentIndex(index) { currentIndex = index; },
            get currentQuestion() { return questions[currentIndex]; },

            get length() { return questions.length; },

            randomQuestion()
            {
                if(questions.length < 1) return "No Questions Anymore";

                //-2 coz max is including
                var index = this.random(0, questions.length - 2);
                currentIndex = index;
                var tempQuestion = questions[index];
                console.log("-------------------------");
                console.log("Index : " + index);

                //Delete to protect overlap
                //questions.splice(index, 1);
                return tempQuestion;
            },

            random(min, max) {
                var randomNum = (Math.random() * (max - min)) + min;
                return Math.round(randomNum);
            },
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

var instance = Question.getInstance();
export default instance;