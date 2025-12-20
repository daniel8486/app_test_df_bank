<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cliente>
 */
class ClienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'nome' => $this->faker->name(),
            'cpf' => $this->generateCpf(),
            'email' => $this->faker->unique()->safeEmail(),
            'idade' => $this->faker->numberBetween(18, 90),
            'endereco' => $this->faker->address(),
        ];
    }

    private function generateCpf(): string
    {
        $n = [];
        for ($i = 0; $i < 9; $i++) {
            $n[$i] = random_int(0, 9);
        }
        for ($t = 9; $t < 11; $t++) {
            $d = 0;
            for ($c = 0; $c < $t; $c++) {
                $d += $n[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            $n[$t] = $d;
        }

        return implode('', $n);
    }
}
