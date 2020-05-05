const GAME_MANAGER = require("./models/GameManager.js");
const QUESTION = require("./models/Question.js");
const ROUND = require("./models/Round.js");

cc.Class({
    extends: cc.Component,

    properties: {
        grassLands: [cc.Node],
        buildings: [cc.Prefab],
    },

    // LIFE-CYCLE CALLBACKS:
    //Init Functions
    initComponents() {
        cc.log("UIManager.initComponents()");
        this.startPage = cc.find(PATHS.START_PAGE);
        this.mainPage = cc.find(PATHS.MAIN_PAGE);

        //Panels
        this.buildingPanel = cc.find(PATHS.BUILDING_PANEL);
        this.buildPanel = cc.find(PATHS.BUILD_PANEL);
        this.questionPanel = cc.find(PATHS.QUESTION_PANEL);
        cc.log(PATHS.QUESTION_PANEL);
        this.resultPanel = cc.find(PATHS.RESULT_PANEL);

        //Icons
        this.fillBgSociety = cc.find(PATHS.FILL_BG_SOCIETY).getComponent(cc.Sprite);
        this.fillBgFinancial = cc.find(PATHS.FILL_BG_FINANCIAL).getComponent(cc.Sprite);
        this.fillBgEnvironment = cc.find(PATHS.FILL_BG_ENVIRONMENT).getComponent(cc.Sprite);

        //Labels
        this.lblMonth = cc.find(PATHS.LBL_MONTH).getComponent(cc.Label);
        this.lblYear = cc.find(PATHS.LBL_YEAR).getComponent(cc.Label);

        this.questionTitle = cc.find(PATHS.QUESTION_TITLE).getComponent(cc.Label);
        this.questionContent = cc.find(PATHS.QUESTION_CONTENT).getComponent(cc.Label);
        this.questionCharacter = cc.find(PATHS.QUESTION_CHARACTER).getComponent(cc.Sprite);

        this.lblLeadYears = cc.find(PATHS.LBL_LEAD_YEARS).getComponent(cc.Label);

        //Buttons
        this.btnBuildWithMoney = cc.find(PATHS.BTN_BUILD_WITH_MONEY);
        this.btnBuildWithMoney.on("click", this.buildWithMoney, this);

        this.btnBuildFree = cc.find(PATHS.BTN_BUILD_FREE);
        this.btnBuildFree.on("click", this.buildFree, this);

        this.btnYes = cc.find(PATHS.BTN_YES);
        this.lbbtnYes = cc.find(PATHS.LB_BTN_YES).getComponent(cc.Label);
        this.btnYes.on('click', this.clickedYes, this);

        this.btnNo = cc.find(PATHS.BTN_NO);
        this.lbbtnNo = cc.find(PATHS.LB_BTN_NO).getComponent(cc.Label);
        this.btnNo.on('click', this.clickedNo, this);
    },

    initData () {
        this.pauseGame = false;
        this.timer = 0;
    },

    initEmptyLands () {
        this.emptyGrassLands = new Array(this.grassLands.length);
        for(var i = 0; i < this.grassLands.length; i++) {
            this.emptyGrassLands[i] = true;
        }
    },

    onLoad () {
        this.initComponents();
        this.initData();
        this.initEmptyLands();
    },

    start () {
        this.restartGame();
    },

    //Others
    goToGame() {
        this.startPage.active = false;
        this.mainPage.active = true;
    },

    restartGame() {
        this.deleteAllBuildings();

        this.startPage.active = true;
        this.mainPage.active = false;

        this.closeAllPanels();
        this.buildPanel.active = true;

        GAME_MANAGER.resetData();
        ROUND.resetData();
        this.updateFillValuesEFS();
        this.lblMonth.string = GAME_MANAGER.month;
        this.lblYear.string = GAME_MANAGER.yrCounter;

        this.showTimer();
    },

    updateFillValuesEFS() {
        this.fillBgEnvironment.fillRange = GAME_MANAGER.environment / GAME_MANAGER.maxEnvironment;
        this.fillBgFinancial.fillRange = GAME_MANAGER.financial / GAME_MANAGER.maxFinancial;
        this.fillBgSociety.fillRange = GAME_MANAGER.society / GAME_MANAGER.maxSociety;
    },

    createHouse(type) {
        var randomLandIndex = this.getRandomLandPosition();
        if(randomLandIndex == -1) {
            GAME_MANAGER.gameOver = true;
            this.gameOver();
        } else {
            var randomSpawnPos = this.grassLands[randomLandIndex].position;

            var building = cc.instantiate(this.buildings[type]);
            building.position = randomSpawnPos;
            //Add 20px at Y axis
            building.setPosition(building.getPosition().x , building.getPosition().y + 20);

            this.buildingPanel.addChild(building);
        }
    },

    getRandomLandPosition() {
        var randomIndex = -1;
        if(this.emptyGrassLands.length > 0) {
            var length = this.emptyGrassLands.length;
            randomIndex = this.random(0, length - 1);
            this.emptyGrassLands.splice(randomIndex, 1);
        }
        return randomIndex;
    },

    emitRandomQuestions() {
        var randomTime = this.random(1000, 4000);
        setTimeout(() => {
            //if(!this.buildPanel.active && !this.questionPanel.active)
            this.showQuestionPanel();
        }, randomTime);
    },

    showQuestionPanel() {
        if(!this.buildPanel.active && !GAME_MANAGER.gameOver && !this.questionPanel.active) {
            cc.log(QUESTION);
            this.currentQuestion = QUESTION.randomQuestion();
            this.questionTitle.string = this.currentQuestion.QuestionTitle;
            this.questionContent.string = this.currentQuestion.QuestionContent;
            iconname = "images/"+this.currentQuestion.Character;
            cc.log(iconname);
            var self = this;
            cc.loader.loadRes(iconname, cc.SpriteFrame, function (err, spriteFrame) {
                self.questionCharacter.spriteFrame = spriteFrame;
            });
            this.lbbtnYes.string = this.currentQuestion.YesText;
            this.lbbtnNo.string = this.currentQuestion.NoText;

            this.questionPanel.active = true;
        }
    },

    showResultPanel() {
        var output = "";

        output += GAME_MANAGER.yrCounter;

        if(GAME_MANAGER.yrCounter > 1) output += " years ";
        else output += " year ";

        output += GAME_MANAGER.mthCounter + 1;

        if((GAME_MANAGER.mthCounter+1) > 1) output += " months";
        else output += " month";

        this.lblLeadYears.string = output;

        this.resultPanel.active = true;
    },

    //Event Functions
    clickedYes () {
        this.questionPanel.active = false;

        //Update Data
        GAME_MANAGER.updateEFS(QUESTION.currentQuestion, true);

        //Update UI
        this.updateFillValuesEFS();

        //Check Game Over or Emit Question Event
        if(GAME_MANAGER.gameOver) {
            this.gameOver();
        }
    },

    clickedNo() {
        this.questionPanel.active = false;

        //Update Data
        GAME_MANAGER.updateEFS(QUESTION.currentQuestion, false);

        //Update UI
        this.updateFillValuesEFS();

        //Check Game Over or Emit Question Event
        if(GAME_MANAGER.gameOver) {
            this.gameOver();
        }
    },

    buildWithMoney() {
        this.buildPanel.active = false;

        //Update Financial
        GAME_MANAGER.buildWithMoney();
        this.updateFillValuesEFS();

        if(GAME_MANAGER.gameOver) {
            this.gameOver();
        } else {
            this.createHouse(0);
        }
    },

    buildFree() {
        this.buildPanel.active = false;
        this.createHouse(1);
    },

    //Update Functions
    updateYearAndMonth() {
        GAME_MANAGER.mthCounter++;

        if(GAME_MANAGER.mthCounter > 11) {
            GAME_MANAGER.mthCounter = 0;
            GAME_MANAGER.yrCounter++;
            this.lblYear.string = GAME_MANAGER.yrCounter;
        }
        this.lblMonth.string = GAME_MANAGER.month;
    },

    //Common Functions
    random(min, max) {
        var randomNum = (Math.random() * (max - min)) + min;
        return Math.round(randomNum);
    },

    showTimer() {
        var timer = setInterval(() => {
            if(GAME_MANAGER.gameOver) {
                clearInterval(timer);
            } else {
                if(this.buildPanel.active || this.questionPanel.active)
                    return;

                    //Update Year And Month
                this.timer++;
                if(this.timer == 60) this.timer = 0;

                if((this.timer % 3) == 0) {
                    this.updateYearAndMonth();
                    ROUND.updateRound();
                }
                var randomPercentage = this.random(0, 100);

                //console.log(randomPercentage + " <= " + ROUND.currentPercentage);
                if(randomPercentage <= ROUND.currentPercentage)
                {
                    console.log(randomPercentage + " <= " + ROUND.currentPercentage);
                    this.showQuestionPanel();
                }
                else
                {
                    console.log("Timer : " + this.timer);
                }
            }
        }, 1000);
    },

    closeAllPanels() {
        this.buildPanel.active = false;
        this.questionPanel.active = false;
        this.resultPanel.active = false;
    },

    gameOver() {
        this.closeAllPanels();
        this.showResultPanel();
    },

    deleteAllBuildings() {
        var buildings = this.buildingPanel.children;
        for(var i = 0; i < buildings.length; i++) {
            buildings[i].destroy();
        }
    }

});
