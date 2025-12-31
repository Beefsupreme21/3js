<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/game', function () {
    return Inertia::render('Game');
})->name('game');

Route::get('/golf', function () {
    return Inertia::render('Golf');
})->name('golf');

Route::get('/pokemon', function () {
    return Inertia::render('Pokemon');
})->name('pokemon');

Route::get('/golf2', function () {
    return Inertia::render('Golf2');
})->name('golf2');

Route::get('/golf3', function () {
    return Inertia::render('Golf3');
})->name('golf3');

Route::get('/boat', function () {
    return Inertia::render('Boat');
})->name('boat');

Route::get('/path', function () {
    return Inertia::render('Path');
})->name('path');

Route::get('/path2', function () {
    return Inertia::render('Path2');
})->name('path2');
