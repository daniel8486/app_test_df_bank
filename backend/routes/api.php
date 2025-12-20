<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClienteController;

Route::get('clientes-search', [ClienteController::class, 'search']);
Route::apiResource('clientes', ClienteController::class);
