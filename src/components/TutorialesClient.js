'use client'

import Link from 'next/link'
import { BookOpen, Clock, Users, TrendingUp, CheckCircle, Play, Star, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const TutorialesClient = ({ tutorials }) => {
  const categories = ['Todos', 'Presupuesto', 'Ahorro', 'Inversión', 'Deudas', 'Jubilación', 'Ingresos']
  const difficulties = ['Todos', 'Principiante', 'Intermedio', 'Avanzado']

  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Todos')

  const filteredTutorials = tutorials.filter(tutorial => {
    const categoryMatch = selectedCategory === 'Todos' || tutorial.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'Todos' || tutorial.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Principiante': 'bg-emerald/10 text-emerald',
      'Intermedio': 'bg-orange/10 text-orange',
      'Avanzado': 'bg-navy/10 text-navy'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const featuredTutorials = tutorials.filter(tutorial => tutorial.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Learning Path */}
        <div className="bg-light-gray rounded-xl shadow-sm p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Tu Ruta de Aprendizaje Recomendada
            </h2>
            <p className="text-xl text-gray-600">
              Sigue este orden para construir una base sólida en finanzas personales
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-emerald/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald/20 transition-all duration-300">
                <span className="text-3xl font-bold text-emerald">1</span>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Fundamentos</h3>
              <p className="text-gray-600 text-lg">Presupuesto y control de gastos</p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-500">• Crear presupuesto</div>
                <div className="text-sm text-gray-500">• Controlar gastos</div>
                <div className="text-sm text-gray-500">• Establecer metas</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-orange/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-orange/20 transition-all duration-300">
                <span className="text-3xl font-bold text-orange">2</span>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Protección</h3>
              <p className="text-gray-600 text-lg">Fondo de emergencia y manejo de deudas</p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-500">• Fondo emergencia</div>
                <div className="text-sm text-gray-500">• Eliminar deudas</div>
                <div className="text-sm text-gray-500">• Seguros básicos</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-navy/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-navy/20 transition-all duration-300">
                <span className="text-3xl font-bold text-navy">3</span>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-3">Crecimiento</h3>
              <p className="text-gray-600 text-lg">Inversión y planificación a largo plazo</p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-500">• Primeras inversiones</div>
                <div className="text-sm text-gray-500">• Jubilación</div>
                <div className="text-sm text-gray-500">• Aumentar ingresos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tutorials */}
        <div className="mb-12" id="tutoriales">
          <div className="flex items-center mb-8">
            <TrendingUp className="h-8 w-8 text-emerald mr-3" />
            <h2 className="text-3xl font-bold text-navy">
              Tutoriales Destacados
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-100 ring-2 ring-emerald/20">
                <div className="bg-gradient-to-r from-emerald to-green-600 text-white px-4 py-3 text-sm font-bold text-center">
                  ⭐ Tutorial Destacado
                </div>
                
                {/* Tutorial Image */}
                <div className="h-48 bg-gradient-to-br from-emerald to-green-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl">{tutorial.category}</span>
                </div>

                <div className="p-8">
                  {/* Tutorial Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-navy mb-3">{tutorial.title}</h3>
                      <p className="text-gray-600 mb-4 text-lg leading-relaxed">{tutorial.description}</p>
                    </div>
                  </div>

                  {/* Tutorial Meta */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6 text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        <span className="font-medium">{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        <span className="font-medium">{tutorial.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        <span className="font-medium">{tutorial.steps} pasos</span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    <div className="flex items-center mr-3">
                      {renderStars(tutorial.rating)}
                    </div>
                    <span className="text-lg font-semibold text-navy">{tutorial.rating}</span>
                    <span className="text-gray-500 ml-2">({tutorial.students} estudiantes)</span>
                  </div>

                  {/* What You'll Learn */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-navy mb-3">Lo que aprenderás:</h4>
                    <ul className="text-gray-600 space-y-2">
                      {tutorial.whatYoullLearn.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-emerald mr-3 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/tutoriales/${tutorial.slug}`}
                    className="w-full bg-emerald text-white px-8 py-4 rounded-xl hover:bg-green-600 transition-all duration-200 font-semibold text-center inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Comenzar tutorial
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Tutorials */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-navy">
              Todos los Tutoriales
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 border border-gray-100">
                {/* Tutorial Image */}
                <div className="h-40 bg-gradient-to-br from-emerald to-green-600 flex items-center justify-center">
                  <span className="text-white font-semibold">{tutorial.category}</span>
                </div>

                <div className="p-6">
                  {/* Tutorial Title */}
                  <h3 className="text-lg font-bold text-navy mb-3 leading-tight">
                    <Link
                      href={`/tutoriales/${tutorial.slug}`}
                      className="hover:text-emerald transition-colors duration-200"
                    >
                      {tutorial.title}
                    </Link>
                  </h3>

                  {/* Tutorial Meta */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{tutorial.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{tutorial.steps}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {renderStars(tutorial.rating)}
                    </div>
                    <span className="text-sm font-semibold text-navy">{tutorial.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({tutorial.students})</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {tutorial.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={`/tutoriales/${tutorial.slug}`}
                    className="w-full bg-emerald text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-200 font-semibold text-center inline-flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Comenzar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default TutorialesClient