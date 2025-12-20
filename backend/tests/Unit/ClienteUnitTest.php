<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Rules\ValidCpf;

class ClienteUnitTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_cpf_valido()
    {
        $rule = new ValidCpf();
        $this->assertTrue($rule->passes('cpf', '52998224725'));
    }

    public function test_cpf_invalido()
    {
        $rule = new ValidCpf();
        $this->assertFalse($rule->passes('cpf', '12345678900'));
    }
}
