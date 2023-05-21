var FOOD_BIT = 192;

var FoodType = {
	NONE: 0,
	NORMAL: 128,
    SUPER: 192,
    
    getScore: function(foodType) {
        if (foodType == FoodType.NORMAL) return 10;
        else if (foodType == FoodType.SUPER) return 50;
        else return 0;
    },
    
    getMovePenalty: function(foodType) {
        if (foodType == FoodType.NORMAL) return 0.045;
        else if (foodType == FoodType.SUPER) return 0.135;
        else return 0;
    },
};