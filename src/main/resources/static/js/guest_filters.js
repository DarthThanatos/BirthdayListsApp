GuestHome.filter('mode_to_color', function() {
        return function(input, btn_mode) {
        	return "background: " + (input==btn_mode ? "#FF8C2F;" : "#666666;");
        };
    }
);
