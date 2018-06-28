GuestHome.filter('mode_to_color', function() {
        return function(input, btn_mode) {
        	return "background: " + (input==btn_mode ? "#FF8C2F;" : "#666666;");
        };
    }
);

GuestHome.filter('trimPresentDescription', function() {
        return function(presentDescription) {
        	return presentDescription.length > 135 ? presentDescription.substring(0, 135) + ("\n(...)") : presentDescription
        };
    }
);


GuestHome.filter('trimShopLink', function() {
        return function(shopLink) {
        	return shopLink.length > 35 ? "" : shopLink
        };
    }
);


GuestHome.filter('trimPresentName', function() {
        return function(presentName) {
        	return  presentName.length > 10 ? presentName.substring(0,10).replace(/\s/g, '_') + "(...)" : presentName
        };
    }
);