// Author: Ryan Overdeer

// Includes
const fs = require('fs')
const path = require('path')

function querySplitPreserve(queryString){
    var queryStringCharacters = queryString.split('')
    queryStringCharacters.reverse() // reverse to use pop()

    var quoteStack = []
    var wordStack = []
    var stringStack = []

    var iteration = 0
    var max = 1000
    while (queryStringCharacters.length > 0 && iteration < max){
        var character = queryStringCharacters[queryStringCharacters.length-1]
        
        switch(character){
            case `'`:
                wordStack.push(character)
                if (quoteStack.length > 0){
                    stringStack.push(wordStack.join(''))
                    wordStack = []
                    quoteStack.pop()
                }
                else {
                    quoteStack.push(character)
                }
                queryStringCharacters.pop()
                break
            case ' ':
                if (quoteStack.length == 0){
                    stringStack.push(wordStack.join(''))
                    wordStack = []
                    queryStringCharacters.pop()
                }
                else{
                    wordStack.push(character)
                    queryStringCharacters.pop()
                }
                break
            default: 
                wordStack.push(character)
                queryStringCharacters.pop()
                break
        }

        iteration++
    }

    var final = []

    for (var i = 0; i < stringStack.length; i++){
        if (stringStack[i] != ''){
            final.push(stringStack[i])
        }
    }

    return final
}

function query(queryString) {
    // Separate the string into words, by a space
    var queryWords = querySplitPreserve(queryString)
    console.log(queryWords)
    // Invert the string to create a stack structure
    queryWords.reverse()

    var queryAction = null // 'FIND', 'GET', 'UPDATE', 'DELETE'
    var queryType = null // 'FOLDER', 'FILE'
    var propertyField = null // 'id', '(propertyName)'
    var propertyValue = null // '86', 'hello world'
    var fileName = null // 'meta', 'body'
    var fileFormat = null // 'json', 'txt'
    
    // Used in while loop below
    var word
    function setWord(){
        word = queryWords[queryWords.length-1]
        return
    }

    // Loop through the stack
    // Safety variables, ensures while loop doesn't crash
    var iteration = 0
    var max = 1000

    while (queryWords.length > 0 && iteration < max){
        setWord() // Ensure the top of stack is the current word
        switch(word){
            // Query Action cases
            case 'FIND':
                queryAction = word
                queryWords.pop()
                break;
            case 'GET':
                queryAction = word
                queryWords.pop()
                break;
            case 'UPDATE':
                queryAction = word
                queryWords.pop()
                break;
            case 'DELETE':
                queryAction = word
                queryWords.pop()
                break;

            // Query Type cases
            case 'FOLDER':
                queryType = word
                queryWords.pop()
                break;
            case 'FILE':
                queryType = word
                queryWords.pop()
                break;

            // Property Field
            case 'BY':
            case 'WITH':
                queryWords.pop()
                setWord() // Pops the instruction word off the stack, current word should be a property field name
                if (word.includes(`'`)){
                    propertyField = word
                    queryWords.pop()
                }
                setWord()
                if (word.includes(`'`)){
                    propertyValue = word
                    queryWords.pop()
                }
                break;
            case 'IN':
                queryWords.pop()
                setWord() // Pops the instruction word off the stack, current word should be filename
                if (word.includes(`'`)){
                    fileName = word
                    queryWords.pop()
                }
                break;
            case 'FORMAT':
                queryWords.pop()
                setWord()
                if (word.includes(`'`)){
                    fileFormat = word
                    queryWords.pop()
                }
                break;
            default:
                queryWords.pop()
                break
        }

        iteration++
    }

    console.log(queryAction, queryType, propertyField, propertyValue, fileName, fileFormat)
}

var queryString = `FIND FOLDER BY 'name' 'Ryan Overdeer' IN 'meta'`

console.log(query(queryString))