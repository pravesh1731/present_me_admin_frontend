import React from 'react'

const HomePage = () => {
  return (
	<section className="space-y-6">
							<div className="rounded-xl bg-gradient-to-r from-[#0BCCEB] to-[#0A80F5] text-white p-8 shadow-md"> 
								<h2 className="text-2xl font-semibold">Welcome back, Admin</h2>
								<p className="mt-1">Here's what's happening with your attendance system today.</p>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
								<div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-500">Total Teachers</div>
										<div className="bg-green-100 p-2 rounded-full text-green-600">👥</div>
									</div>
									<div className="mt-4 text-3xl font-bold">24</div>
									<div className="text-xs text-gray-400 mt-1">3 pending approval</div>
								</div>

								<div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-500">Total Students</div>
										<div className="bg-green-100 p-2 rounded-full text-green-600">🎓</div>
									</div>
									<div className="mt-4 text-3xl font-bold">486</div>
									<div className="text-xs text-gray-400 mt-1">Across 12 classes</div>
								</div>

								<div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-500">Pending Approvals</div>
										<div className="bg-yellow-100 p-2 rounded-full text-yellow-600">⏳</div>
									</div>
									<div className="mt-4 text-3xl font-bold">3</div>
									<div className="text-xs text-gray-400 mt-1">Teacher applications</div>
								</div>

								<div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-500">Today's Attendance</div>
										<div className="bg-green-100 p-2 rounded-full text-green-600">📈</div>
									</div>
									<div className="mt-4 text-3xl font-bold">92%</div>
									<div className="text-xs text-gray-400 mt-1">447 out of 486 students</div>
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
								<h3 className="text-lg font-semibold">Recent Activity</h3>
								<p className="text-sm text-gray-500">Latest updates from your attendance system</p>

								<ul className="mt-4 space-y-3">
									<li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
										<div className="flex items-center gap-4">
											<div className="bg-yellow-100 p-3 rounded-full">⏰</div>
											<div>
												<div className="font-medium">New teacher application</div>
												<div className="text-xs text-gray-500">Sarah Johnson</div>
											</div>
										</div>
										<div className="text-xs text-yellow-600">2 hours ago</div>
									</li>

									<li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
										<div className="flex items-center gap-4">
											<div className="bg-green-100 p-3 rounded-full">✅</div>
											<div>
												<div className="font-medium">Attendance submitted</div>
												<div className="text-xs text-gray-500">Math Class - Grade 10</div>
											</div>
										</div>
										<div className="text-xs text-green-600">3 hours ago</div>
									</li>

									<li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
										<div className="flex items-center gap-4">
											<div className="bg-green-100 p-3 rounded-full">✅</div>
											<div>
												<div className="font-medium">Teacher approved</div>
												<div className="text-xs text-gray-500">Michael Chen</div>
											</div>
										</div>
										<div className="text-xs text-green-600">5 hours ago</div>
									</li>

									<li className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
										<div className="flex items-center gap-4">
											<div className="bg-green-100 p-3 rounded-full">✅</div>
											<div>
												<div className="font-medium">New Message received</div>
												<div className="text-xs text-gray-500">English Department</div>
											</div>
										</div>
										<div className="text-xs text-green-600">1 Day ago</div>
									</li>
								</ul>
														</div>
			</section>
	)
}

export default HomePage;