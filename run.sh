mvn clean package
gnome-terminal -e "npm run-script watch" --window-with-profile=hold
java -jar ./target/podarujmi-back.jar 

