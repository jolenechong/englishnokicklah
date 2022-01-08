# englishnokickla
Find it difficult to write in formal english or simply prefer to write in Singlish? With the help of the paraphrasing API from pegasus,
<a href='https://huggingface.co/tuner007/pegasus_paraphrase'>https://huggingface.co/tuner007/pegasus_paraphrase</a>, we managed to create a
chrome extension that transforms your Singlish sentences to Proper English sentences.

## How we did it
We realised there weren't any datasets with Singlish And English Translation so we created our own. Then, we remove puncutations from the given paragraph and spilt up the paragraph according to the punctuations, then we switch out singlish words for english words in order for the sentence to retain its meaning. Finally, we use the Pegasus Paraphrase API from HuggingFace to get rearrange the phrases so that they make sense.
<br><br>
Check out how it works with out jupyter notebook file!
<a href='https://github.com/jolenechong/englishnokicklah/blob/main/englishnokicklah.ipynb'>Jupyter Notebook Here</a>

## How to use
<img src='rephrased.png'>
Entering 'brb i need to check smth, btw the meeting tmr i need to come or nt ah' which has a lot of Singlish Phrases and Shortform, would return 2
phrases in Proper English.

<br>
<img src='index.png'>
We also have a web interface to convert Singlish to English!
