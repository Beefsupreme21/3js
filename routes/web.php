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
