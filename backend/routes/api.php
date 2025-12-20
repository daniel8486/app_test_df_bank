<?php

use App\Http\Controllers\Api\ClienteController;
use Illuminate\Support\Facades\Route;

Route::get('clientes-search', [ClienteController::class, 'search']);
Route::apiResource('clientes', ClienteController::class);
