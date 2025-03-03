import React, {useCallback, useState, useEffect, useRef} from 'react';
import {fabric} from 'fabric';
import {strToInt} from './SketchColor';
import axios from 'axios';


export const Draw_Square = (canvas, fillColor)=>{
    canvas.on('mouse:down', (e)=>{mousedown(e,fillColor)});
    var started = false;
    var x1=0, x2=0;
    var y1=0, y2=0;
    
    function mousedown(e,fillColor) {
        if (started == false) {
            let mouse = canvas.getPointer(e);
            started = true;
            x1 = mouse.x;
            y1 = mouse.y;
        }
        else {
            let mouse = canvas.getPointer(e);
            started = false;
            x2 = mouse.x;
            y2 = mouse.y;
            if (x1 > x2) {
                let tmp = x1;
                x1 = x2;
                x2 = tmp;
            }
            if (y1 > y2) {
                let tmp = y1;
                y1 = y2;
                y2 = tmp;
            }

            let newShape = new fabric.Rect({
                width: x2-x1,
                height: y2-y1,
                left: x1,
                top: y1,
                angle: 0,
                fill: fillColor,
            });

            canvas.add(newShape);
            canvas.renderAll();
        }
    }
}

export const Draw_Triangle = (canvas, fillColor)=>{
    canvas.on('mouse:down', (e)=>{mousedown(e,fillColor)});
    var started = false;
    var x1=0, x2=0;
    var y1=0, y2=0;
    
    function mousedown(e,fillColor) {
        if (started == false) {
            let mouse = canvas.getPointer(e);
            started = true;
            x1 = mouse.x;
            y1 = mouse.y;
        }
        else {
            let mouse = canvas.getPointer(e);
            started = false;
            x2 = mouse.x;
            y2 = mouse.y;
            if (x1 > x2) {
                let tmp = x1;
                x1 = x2;
                x2 = tmp;
            }
            if (y1 > y2) {
                let tmp = y1;
                y1 = y2;
                y2 = tmp;
            }

            let newShape = new fabric.Triangle({
                width: x2-x1,
                height: y2-y1,
                left: x1,
                top: y1,
                angle: 0,
                fill: fillColor,
              });

            canvas.add(newShape); 
            canvas.renderAll();
        }
    }
}

export const Draw_Circle = (canvas, fillColor)=>{
    canvas.on('mouse:down', (e)=>{mousedown(e,fillColor)});
    var started = false;
    var x1=0, x2=0;
    var y1=0, y2=0;
    
    function mousedown(e,fillColor) {
        if (started == false) {
            let mouse = canvas.getPointer(e);
            started = true;
            x1 = mouse.x;
            y1 = mouse.y;
        }
        else {
            let mouse = canvas.getPointer(e);
            started = false;
            x2 = mouse.x;
            y2 = mouse.y;
            let R = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
            let newShape = new fabric.Circle({
                radius: Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)),
                left: x1-R,
                top: y1-R,
                fill: fillColor,
              });

            canvas.add(newShape); 
            canvas.renderAll();
        }
    }
}

export const Draw_Line = (canvas, penWidth, penColor, penOpacity)=>{
    canvas.on('mouse:down', (e)=>{mousedown(e,penWidth,penColor,penOpacity)});
    var started = false;
    var x1=0, x2=0;
    var y1=0, y2=0;
    
    function mousedown(e,fillColor) {
        if (started == false) {
            let mouse = canvas.getPointer(e);
            started = true;
            x1 = mouse.x;
            y1 = mouse.y;
        }
        else {
            let mouse = canvas.getPointer(e);
            started = false;
            x2 = mouse.x;
            y2 = mouse.y;

            let newShape = new fabric.Line(
                [x1,y1,x2,y2],
                {
                    strokeWidth:penWidth,
                    stroke:penColor,
                    opacity:penOpacity/256
                });

            canvas.add(newShape); 
            canvas.renderAll();
        }
    }
}


export const Draw_Polygon = (canvas, fillColor, PolyNum)=>{
    canvas.on('mouse:down', (e)=>{mousedown(e,fillColor, PolyNum)});
    var started = 0;
    var xy = [];
    var xsum = 0;
    var ysum = 0;
    
    function mousedown(e,fillColor) {
        if (started < PolyNum-1) {
            let mouse = canvas.getPointer(e);
            started += 1;
            xy.push({x:mouse.x,y:mouse.y});
            xsum += mouse.x;
            ysum += mouse.y;
        }
        else {
            let mouse = canvas.getPointer(e);
            started = 0;
            xy.push({x:mouse.x,y:mouse.y});
            xsum += mouse.x;
            ysum += mouse.y;
            let newShape = new fabric.Polygon(
                xy,
                {
                    center: new fabric.Point(xsum/PolyNum,ysum/PolyNum),
                    fill: fillColor,
                });
            xy = [];
            xsum = ysum = 0;
            canvas.add(newShape); 
            canvas.renderAll();
        }
    }
}

export const Draw_TextBox = (canvas,penColor,penOpacity,TextSize,TextFont,TextInput) =>{
    let rgba = strToInt(penColor);
	let fillColor = 'rgba('+rgba.r+','+rgba.g+','+rgba.b+','+penOpacity/256+')'
    let Weight = "normal";
    let Style = 'normal';
    if (TextFont == 'Bold') {
        Weight = "bold";
    }
    else if (TextFont == 'italic') {
        Style = 'italic';
    }
    else if (TextFont == 'Bold italic') {
        Weight = "bold";
        Style = 'italic';
    }
    const newTextBox = new fabric.Textbox(TextInput, {
        left: 50,
        top: 50,
        fontSize: TextSize,
        fontWeight: Weight,
        fontStyle: Style,
        stroke:fillColor,
        fill:fillColor
    });
    canvas.add(newTextBox);
}


export const Draw_Image = async (canvas, DrawInput_prompt, DrawImageAi_Alpha) => {
    if (canvas) {
        if (DrawInput_prompt.length > 0) {
            let base64Image = ''; // Base64 데이터를 저장할 변수

            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

            const generateImage = async () => {
                try {
                    const requestData = {
                        model: "dall-e-3",
                        prompt: `Draw a simple and clean sketch of ${DrawInput_prompt} with simple lines that I can use as a reference. Minimize details, reduce the size, and prioritize quick output.`,
                        size: "1024x1024",
                        n: 1,
                        response_format: "b64_json",
                    };

                    console.log("Request Data:", requestData);

                    const response = await axios.post(
                        "https://api.openai.com/v1/images/generations",
                        requestData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${apiKey}`,
                            },
                        }
                    );

                    // Base64 데이터 추출
                    base64Image = `data:image/jpeg;base64,${response.data.data[0].b64_json}`;
                    console.log("Generated Base64 Image:", base64Image.substring(0, 100) + "..."); // Base64 데이터의 앞부분만 출력

                } catch (error) {
                    console.error("Error generating image:", error.response?.data || error.message);
                }
            };

            await generateImage();

            const AddImagetoCanvas = async (base64Image) => {
                if (base64Image.length > 0) {
                    // Base64 데이터를 Fabric.js로 추가
                    fabric.Image.fromURL(base64Image, function (img) {
                        img.set({
                            left: 50,
                            top: 50,
                            opacity: DrawImageAi_Alpha / 256,
                        });
                        img.scaleToWidth(256);
                        img.set({ scaleY: 256 / img.height });

                        canvas.add(img);
                        canvas.renderAll();
                    });
                } else {
                    console.error("Base64 image data is empty.");
                }
            };

            await AddImagetoCanvas(base64Image);
        }
    }
};

/*
export const Draw_Image = async (canvas, DrawInput_prompt, DrawImageAi_Alpha) => {
    if (canvas) {
        if (DrawInput_prompt.length > 0) {
            let base64Image = ''; // Base64 데이터를 저장할 변수

            const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

            const generateImage = async () => {
                try {
                    const requestData = {
                        model: "dall-e-3",
                        prompt: `Draw a simple and clean sketch of ${DrawInput_prompt} with simple lines that I can use as a reference. Minimize details, reduce the size, and prioritize quick output.`,
                        size: "1024x1024",
                        n: 1,
                        response_format: "b64_json",
                    };

                    console.log("Request Data:", requestData);

                    const response = await axios.post(
                        "https://api.openai.com/v1/images/generations",
                        requestData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${apiKey}`,
                            },
                        }
                    );

                    // Base64 데이터 추출
                    base64Image = `data:image/jpeg;base64,${response.data.data[0].b64_json}`;
                    console.log("Generated Base64 Image:", base64Image.substring(0, 100) + "..."); // Base64 데이터의 앞부분만 출력

                } catch (error) {
                    console.error("Error generating image:", error.response?.data || error.message);
                }
            };

            await generateImage();

            const AddImagetoCanvas = async (base64Image) => {
                if (base64Image.length > 0) {
                    // Base64 데이터를 Fabric.js로 추가
                    fabric.Image.fromURL(base64Image, function (img) {
                        img.set({
                            left: 50,
                            top: 50,
                            opacity: DrawImageAi_Alpha / 256,
                        });
                        img.scaleToWidth(256);
                        img.set({ scaleY: 256 / img.height });

                        canvas.add(img);
                        canvas.renderAll();
                    });
                } else {
                    console.error("Base64 image data is empty.");
                }
            };

            await AddImagetoCanvas(base64Image);
        }
    }
};
*/

export const Draw_TextAi = async (canvas, ImgURL, mode, TextSize) => {
    if (canvas) {  
        console.log("TextAi Run");
        var GenText = '';
          
        var canvas_imgURL = ImgURL;
        //var canvas_imgURL = "https://cdn.prod.website-files.com/632ac1a36830f75c7e5b16f0/64f114380acc29430007c960_OsRSX3WgEDFuAwjISEu3FcQMnK6c900Zkr7q1UeICyg.webp"
        
        const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
        const nameprompt = "Make a short and simple title of this image"
        const sumprompt = "describe this sketch"
        const textprompt = "get the text from this image. response only with the scanned text. Don't start with the text in image, or add explains"
        var modeprompt = '';
        if (mode == 'title') {
            modeprompt = nameprompt;
        }
        else if (mode == 'text') {
            modeprompt = textprompt;
        }

        const AIimage = async () => {
            try {
                // OpenAI API 요청
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                    model: 'gpt-4o', // 사용할 모델
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: "text", text: modeprompt },
                                {
                                type: "image_url",
                                image_url: {
                                "url": canvas_imgURL,
                                },
                                },
                            ],
                        },
                    ],
                    max_tokens: 2000,
                    },
                    {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`, // API 키를 헤더에 포함
                    },
                    }
                );
                
                // 응답 출력
                console.log('Response:', response.data.choices[0].message.content);
                const imageText = response.data.choices[0].message.content;
                GenText = imageText;
            } catch (error) {
                console.error('Error analyzing image:', error.response?.data || error.message);
            }
        };

        await AIimage();

        if (mode == 'text') {
            const AddTextBoxtoCanvas = async (GenText) => {
                console.log("Gen "+GenText);
                const newTextBox = new fabric.Textbox(GenText, {
                    left: 50,
                    top: 50,
                    fontSize: TextSize,
                    width:500
                });
                canvas.add(newTextBox);
                canvas.renderAll();
            }
            await AddTextBoxtoCanvas(GenText);
        }
        else if (mode == 'title') {
            return GenText;
        }
    }
}

/*
	useEffect(()=>{
		
	},[canvas,DrawInput])

	useEffect(()=>{
		if (canvas) {
			if (drawImage == true) {
				
			}
			else {
				canvas.off('mouse:down');
			}
		}
	},[drawImage])
	*/


/*
const saveImage = ()=>{
    let imgdata = canvas.toDataURL({
        format: 'jpeg',
        quality: 0.8
    });
    console.log(imgdata);
    return imgdata
}
//var canvas_imgURL = saveImage();
var canvas_imgURL = "https://www.davincified.com/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0787%2F2646%2F3810%2Ffiles%2Fcb69d5e61d1feaea99bd67db1d3da7a9.jpg%3Fv%3D1725529212&w=1200&q=75"
// OpenAI API 설정
const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // .env 파일에서 API 키 로드

const analyzeImage = async () => {
    try {
    // OpenAI API 요청
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
        model: "gpt-4", // 적절한 모델 선택
        messages: [
            {
            role: "user",
            content: `Make a describe this image. Here is the URL: ${canvas_imgURL}`
            },
        ],
        max_tokens: 300,
        },
        {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        }
    );

    // 응답 출력
    console.log("Response:", response.data.choices[0].message.content);
    } catch (error) {
    console.error("Error analyzing image:", error.response?.data || error.message);
    }
};

analyzeImage();
*/