md bin
md lib
dir /s /B *.java > sources
call mvn compile
call mvn dependency:copy-dependencies -DoutputDirectory=lib
start cmd /K npm run-script watch
javac -d bin -cp "lib/*;bin" @sources
java -cp "bin;lib/*;src/main/resources" pl.edu.agh.io.PodarujMiApplication
