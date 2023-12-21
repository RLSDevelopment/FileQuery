// Author: Ryan Overdeer

// Variables 
const dir = __dirname

// Includes
const fs = require('fs')
const path = require('path')
    // Actions
    const find = require()

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

    if (wordStack.length > 0){
        stringStack.push(wordStack.join(''))
    }

    var final = []

    for (var i = 0; i < stringStack.length; i++){
        if (stringStack[i] != ''){
            final.push(stringStack[i])
        }
    }

    return final
}

function isQueryVariable(word){
    if (word.includes(`'`)) {
        return true
    }
    return false
}

function processQuery(queryString) {
    // Separate the string into words, by a space
    var queryWords = querySplitPreserve(queryString)
    // Invert the string to create a stack structure
    queryWords.reverse()

    var queryAction = null // 'FIND', 'GET', 'UPDATE', 'DELETE'
    var queryType = null // 'FOLDER', 'FILE'
    var jsonPropertyField = null // 'id', '(propertyName)'
    var jsonProperyValue = null // '86', 'hello world'
    
    var name = null
    var format = null
    var count = null
    var size = null

    var sizeless = false
    var sizegreat = false
    
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
                if (isQueryVariable(word)){
                    jsonPropertyField = word
                    queryWords.pop()
                }
                setWord()
                if (isQueryVariable(word)){
                    jsonProperyValue = word
                    queryWords.pop()
                }
                break;
            case 'FORMAT':
                queryWords.pop()
                setWord()
                if (isQueryVariable(word)){
                    format = word
                    queryWords.pop()
                }
                break;
            case 'NAME':
                queryWords.pop()
                setWord()
                if (isQueryVariable(word)) {
                    name = word
                    queryWords.pop()
                }
                break
            case 'COUNT':
                queryWords.pop()
                setWord()
                if (isQueryVariable(word)){
                    count = word
                    queryWords.pop()
                }
                break
            case 'SIZE':
                queryWords.pop()
                setWord()
                if (isQueryVariable(word)){
                    size = word
                    queryWords.pop()
                }
            case 'SIZELESS':
                queryWords.pop()
                sizeless = true
                break
            case 'SIZEGREAT':
                console.log('sizegreat present')
                queryWords.pop()
                sizegreat = true
                break
            default:
                queryWords.pop()
                break
        }

        iteration++
    }

    console.log({queryAction, queryType, jsonPropertyField, jsonProperyValue, name, format, count, size, sizeless, sizegreat})
}

var queryString = `FIND FOLDER SIZE '10mb' SIZELESS`

processQuery(queryString)

console.log(`Execution time ${end-start} ms`)