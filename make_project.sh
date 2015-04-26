#!/bin/sh
mkdir Projects >/dev/null 2>/dev/null
cd Projects
echo ""
echo  "/---------------------------\\"
echo  "|EzMake project setup wizard|"
echo "\\---------------------------/"
echo ""
read -p "What should the project's name be? " projname
echo ""
if [ -d "$projname" ]; then
read -p "The folder $projname already exists.  Overwrite and delete? (Y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
echo "Aborted by user!"
exit 1
fi
rm -R "$projname"
echo ""
fi
prog_lang=""
while true; do
read -p "What language will $projname be programmed in? " lang
langtst=$(echo "$lang" | awk '{print tolower($0)}')
js_ext_hack=".js"
if [ -f "../.easymake/lang/$langtst$js_ext_hack" ]; then
prog_lang="$langtst"
break;
else
echo ""
echo "I'm sorry, but EzMake doesn't support $lang, please choose another language."
echo ""
fi
done
mkdir "$projname"
cd "$projname"
echo ""
read -p "What arguments should the program compile with? " compiler_args
echo ""
java_main_class=""
jar_append=""
if [ "$prog_lang" == "java" ]; then
if [[ "$prog_lang" == *.jar ]]; then
jar_append=".jar"
fi
read -p "What should the main class be?  (Eg. com.test.TestClass) " jclass
echo ""
java_main_class=", \"$jclass\""
fi
read -p "What should the outputted program be called? " filename
file_name="$filename$jar_append"
echo "((require('./.easymake/ez.js'))('$prog_lang'))('$compiler_args', '$file_name'$java_main_class);" > easymake.js
cp -R ../../.easymake .easymake
cp ../../makefile makefile
cp ../../run run
mkdir src
mkdir bin
echo ""
echo "Done!"
