import itertools
import bisect
import json
from collections import defaultdict
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Django Views
def index(request):
    return render(request, 'index.html')

def solution(request):
    return render(request, 'solution.html')

@csrf_exempt
def getUserInput(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get('userInput') is not None:
            global savedInput
            savedInput = data['userInput']
            return JsonResponse({'response': 'good'})

@csrf_exempt
def retrieve(request):
    
    def open_dictionary_file():
        with open('Dictionary.txt', 'r') as filename:
            return filename.read().split()

    def organize_words(words):
        organized_dict = defaultdict(lambda: defaultdict(list))
        for word in words:
            organized_dict[word[0]][len(word)].append(word)
        
        for first_letter in organized_dict:
            for word_length in organized_dict[first_letter]:
                organized_dict[first_letter][word_length].sort()
        
        return organized_dict

    def create_anagrams(input_from_user):
        set_of_final_result = set()
        for length in range(len(input_from_user), 2, -1):
            set_of_final_result.update(
                ''.join(p) for p in itertools.permutations(input_from_user, length)
            )
        return set_of_final_result

    def binary_search_words(dictionary, target):
        index = bisect.bisect_left(dictionary, target)
        if index < len(dictionary) and dictionary[index] == target:
            return target
        return None

    def final_answer(user_input, organized_dictionary):
        user_result = []
        anagrams = create_anagrams(user_input)
        
        for word in anagrams:
            first_letter = word[0]
            word_length = len(word)
            
            if first_letter in organized_dictionary and word_length in organized_dictionary[first_letter]:
                dictionary_content = organized_dictionary[first_letter][word_length]
                result = binary_search_words(dictionary_content, word)
                if result:
                    user_result.append(result)
                    
        return user_result

    def n_letter_words(data):
        sort_list = []
        for i in data:
            sort_list.append(i)
        sort_list.sort(key=len, reverse=False)
        
        arranged_results = {}
        for word in sort_list:
            word_length = str(len(word))
            if word_length not in arranged_results:
                arranged_results[word_length] = []
            arranged_results[word_length].append(word)
        
        return arranged_results

    words = open_dictionary_file()
    organized_dictionary = organize_words(words)
    the_output = final_answer(savedInput, organized_dictionary)
    return JsonResponse({'answer': n_letter_words(the_output)})
