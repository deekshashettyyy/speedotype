import { useState , useEffect , useRef } from "react"

function Body(props)
{
    const questionbox = [
        "I have 2 apples and 3 oranges, which means I can make a delicious fruit salad.",
        "Today is 12th March, 2025, and the weather forecast says it will rain later.",
        "A rectangle has 4 sides and 4 angles, making it one of the simplest shapes.",
        "The bus arrived at 8:15 AM, just in time for the students to get to school.",
        "There are 24 hours in a day, but sometimes it feels like we need more time.",
        "Room temperature is 22 degree Celcius, which is considered comfortable for most people indoors."
    ];

    let[question,setQuestion] = useState("");
    let[answer,setAnswer] = useState("")
    let[wpm,setWpm] = useState(0);
    let[accuracy,setAccuracy] = useState(0);
    let[completed,setCompleted] = useState(false);
    let startTime = useRef(null);

    function handleChange(event)
    {
        if(!startTime.current)  //if startTime=null 
        {
            startTime.current = Date.now();   // for wpm 
        }
        setAnswer(event.target.value);
        calculateResult(event.target.value);
    }

    function reset()
    {
        setQuestion(questionbox[Math.floor(Math.random()*questionbox.length)]);
        setAnswer("");
        setWpm(0);
        setAccuracy(0);
        setCompleted(false);
        startTime.current = null;
    }

    // as soon as page reloads
    useEffect( ()=>
                    {
                        reset();
                    } , []);         //runs only once initially


    function calculateResult(userInput)
    {
        if(!startTime.current)  //timer not started = nothing typed -- return dont calculate wpm / accuracy
        {
            return;
        }
//wpm
        const timeTaken = (Date.now()-startTime.current) / 60000 ;  //Time when typing completed - Time when typing started / converting milliseconds to minutes = 60000
        const totalChars = userInput.replace(/\s/g , "").length;  // remove space in string and calculate length
        const totalWords = totalChars / 5;        //assuming every word has 5char -- 1word = 5ch so givenCh has how many words = totalCh/5
        const currentWpm = timeTaken>0 ? Math.round( totalWords/timeTaken ) : 0 ;  // timeTaken>0 for accidental errors -- words/time = wpm
        setWpm(currentWpm);

//accuracy
        const totalTyped = userInput.length;    // length of current string 
        // ...userInput = spread op = spreads string in userInput to array of char
        const correctCharsArray = [...userInput].filter( (char , i) => char === question[i] );  // char[i] == question[i] = correct char
        const correctTyped = correctCharsArray.length;   //length of correct char
        const currentAccuracy = totalTyped>0 ? Math.round( (correctTyped/totalTyped)*100 ) : 0 ;  // acccuracy = correctchar/totalCh
        setAccuracy(currentAccuracy);

        if(userInput === question)
        {
            setCompleted(true);   //disable textarea
            if(currentWpm>props.best)   //store highest score
            {
                props.setBest(currentWpm);
            }
        }

    }

    return(
        <>
            <div className={props.dabba?"dark-container":"typing-container"}>

 {/* disable copypaste */}
                <p onCopy={ (e)=>{e.preventDefault()} } onContextMenu={ (e)=>e.preventDefault()} className="question" > 
                    {
                        // since its immediately stored no need to store it - right wrong
                        [...question].map(
                            (char,i)=> <span key={i} className={ char===answer[i] ? "correct" : answer[i]? "wrong" :""} >{char}</span>
                        )
                    }
                </p>

                <textarea
                className = "answer"
                placeholder = "start typing here..."
                onPaste={ (e)=> e.preventDefault()}
                onChange = { handleChange }
                value = { answer }
                disabled = { completed }
                />

                <div className="stats">
                    <p>WPM :{wpm} </p>
                    <p>Accuracy : {accuracy} </p>
                </div>

                <button className="restart-btn" onClick={reset} >Restart button</button>

            </div>
        </>
    )

}

export default Body;