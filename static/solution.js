document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('button');
    btn.disabled = true;
    btn.style.opacity = '0.7';
    
    document.querySelector('input').onkeyup = function() {
        if (document.querySelector('input').value === "") {
            btn.disabled = true;
            btn.style.opacity = '0.7';
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
        }
    };
    
    document.querySelector('button').addEventListener('click', function() {
        const user_input = document.querySelector('input').value;
        if (user_input.length > 10) {
            alert('Input must not be greater than 10 words');
        } else {
            document.querySelector('.shadow').style.display = 'block';
            var result_container = document.querySelector('.letters');
            result_container.innerHTML = " ";
            const input_value = document.querySelector('input');
            sendUserInput(input_value.value);
            retrieveOutput();
            document.querySelector('input').value = "";
        }
    });

    function popup() {
        document.querySelector('.shadow').style.display = 'none';
        document.querySelector('.letters').style.display = 'block';
    }

    function sendUserInput(value) {
        fetch('/getUserInput', {
            method: 'POST',
            body: JSON.stringify({
                userInput: value
            })
        });
    }

    function retrieveOutput() {
        fetch('/retrieve')
            .then(response => response.json())
            .then(data => {
                const values = data.answer;
                let totalWords = 0;
                let processedWords = 0;

                for (const words in values) {
                    totalWords += values[words].length;
                }

                if (totalWords === 0) {
                    popup();
                } else {
                    for (const words in values) {
                        if (values[words].length > 0) {
                            const div_element = document.createElement('div');
                            div_element.style.cssText = `margin-bottom:2em`;
                            div_element.className = 'n_words_container';
                            const h1_element = document.createElement('h1');
                            h1_element.innerHTML = `${words} Letters`;
                            h1_element.className = 'count_words';
                            div_element.append(h1_element);

                            values[words].forEach(function(word) {
                                const letters_section = document.createElement('section');
                                letters_section.style.cssText = `display:flex;flex-direction:row;margin-bottom:2em`;
                                letters_section.className = 'word_block';
                                let list_word = word.split('');
                                list_word.forEach(function(list_word) {
                                    const letter_container = document.createElement('div');
                                    letter_container.className = 'letter_block';
                                    letter_container.innerHTML = list_word;
                                    letters_section.append(letter_container);
                                });
                                div_element.append(letters_section);
                                processedWords++;
                                if (processedWords === totalWords) {
                                    popup();
                                }
                            });
                            document.querySelector('.letters').append(div_element);
                        }
                    }
                }
            });
    }
});
